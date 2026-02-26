$ErrorActionPreference = "Stop"

$baseUrl = "http://localhost:3000/api/v1"
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession

Function Test-Endpoint {
    param([string]$Name, [int]$ExpectedCode, [scriptblock]$Action)
    try {
        $res = &$Action
        if ($res.StatusCode -eq $ExpectedCode -or $res.StatusCode -eq 200 -or $res.StatusCode -eq 201 -or $res.StatusCode -eq 204) {
            Write-Host "[PASS] $Name - Status: $($res.StatusCode)" -ForegroundColor Green
            return $res
        } else {
            Write-Host "[FAIL] $Name - Expected: $ExpectedCode, Got: $($res.StatusCode)" -ForegroundColor Red
            return $null
        }
    } catch {
        Write-Host "[FAIL] $Name - Exception: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            $stream = $_.Exception.Response.GetResponseStream()
            if ($stream) {
                $reader = New-Object System.IO.StreamReader($stream)
                $errBody = $reader.ReadToEnd()
                Write-Host "       Body: $errBody" -ForegroundColor Red
            }
        }
        return $null
    }
}

Write-Host "Testing all endpoints..."

# 1. Auth/CSRF
$csrf = Test-Endpoint "GET /csrf/token" 200 { Invoke-WebRequest -Uri "$baseUrl/csrf/token" -Method Get -WebSession $session -UseBasicParsing }
# Parse CSRF Token from Cookie
$csrfCookie = $session.Cookies.GetCookies("http://localhost:3000") | Where-Object Name -eq "taskboard_csrf" | Select-Object -ExpandProperty Value
$headers = @{}
if ($csrfCookie) { $headers["X-CSRF-TOKEN"] = $csrfCookie }

# 2. Auth/Login (using existing user from Browser subagent)
$loginBody = @{ email="user1@test.com"; password="Password123!"; rememberMe=$true } | ConvertTo-Json
$login = Test-Endpoint "POST /auth/login" 200 { Invoke-WebRequest -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json" -WebSession $session -Headers $headers -UseBasicParsing }

# 3. Auth/Me
$me = Test-Endpoint "GET /auth/me" 200 { Invoke-WebRequest -Uri "$baseUrl/auth/me" -Method Get -WebSession $session -Headers $headers -UseBasicParsing }

# 4. Columns POST
$colBody = @{ name="Script Test Column" } | ConvertTo-Json
$createCol = Test-Endpoint "POST /columns" 201 { Invoke-WebRequest -Uri "$baseUrl/columns" -Method Post -Body $colBody -ContentType "application/json" -WebSession $session -Headers $headers -UseBasicParsing }
if (-not $createCol) {
  Write-Host "Create Column failed, cannot continue." -ForegroundColor Red
  exit 1
}
$colId = (ConvertFrom-Json $createCol.Content).data.id

# 5. Columns GET All
$getCols = Test-Endpoint "GET /columns" 200 { Invoke-WebRequest -Uri "$baseUrl/columns" -Method Get -WebSession $session -Headers $headers -UseBasicParsing }

# 6. Columns GET Single
# Some Swagger versions add {id} to endpoint, assume /columns/{id} exists
# If it fails, that's fine. Wait, ColumnsController had GET /columns/id? No, it ONLY had PUT {id} and DELETE {id}. Oh wait, let's skip GET single column if not documented. Actually I saw PUT {id:guid} and DELETE {id:guid}.
# Let's skip GET {id} for now, it's not documented in my previous check. Wait, my prev check had GET /api/v1/columns/{id}. I'll test it.
$getCol = Test-Endpoint "GET /columns/$colId" 200 { Invoke-WebRequest -Uri "$baseUrl/columns/$colId" -Method Get -WebSession $session -Headers $headers -UseBasicParsing }

# 7. Columns PUT (Update)
$colUpdateBody = @{ name="Updated Script Column" } | ConvertTo-Json
$updateCol = Test-Endpoint "PUT /columns/$colId" 200 { Invoke-WebRequest -Uri "$baseUrl/columns/$colId" -Method Put -Body $colUpdateBody -ContentType "application/json" -WebSession $session -Headers $headers -UseBasicParsing }

# 8. Columns PATCH Reorder
$reorderBody = @( @{ id=$colId; order=1 } ) | ConvertTo-Json
$reorderCols = Test-Endpoint "PATCH /columns/reorder" 200 { Invoke-WebRequest -Uri "$baseUrl/columns/reorder" -Method Patch -Body $reorderBody -ContentType "application/json" -WebSession $session -Headers $headers -UseBasicParsing }

# 9. Tasks POST
$taskBody = @{ title="Script Test Task"; description="Task Desc"; columnId=$colId } | ConvertTo-Json
$createTask = Test-Endpoint "POST /tasks" 201 { Invoke-WebRequest -Uri "$baseUrl/tasks" -Method Post -Body $taskBody -ContentType "application/json" -WebSession $session -Headers $headers -UseBasicParsing }
$taskId = (ConvertFrom-Json $createTask.Content).data.id

# 10. Tasks GET All
$getTasks = Test-Endpoint "GET /tasks" 200 { Invoke-WebRequest -Uri "$baseUrl/tasks" -Method Get -WebSession $session -Headers $headers -UseBasicParsing }

# 11. Tasks GET Single
$getTask = Test-Endpoint "GET /tasks/$taskId" 200 { Invoke-WebRequest -Uri "$baseUrl/tasks/$taskId" -Method Get -WebSession $session -Headers $headers -UseBasicParsing }

# 12. Tasks PUT (Update)
$taskUpdateBody = @{ title="Updated Test Task"; description="Updated Task Desc"; columnId=$colId; status="Validation" } | ConvertTo-Json
$updateTask = Test-Endpoint "PUT /tasks/$taskId" 200 { Invoke-WebRequest -Uri "$baseUrl/tasks/$taskId" -Method Put -Body $taskUpdateBody -ContentType "application/json" -WebSession $session -Headers $headers -UseBasicParsing }

# 13. Tasks Move
$taskMoveBody = @{ columnId=$colId; previousTaskId=$null } | ConvertTo-Json
$moveTask = Test-Endpoint "PUT /tasks/$taskId/move" 200 { Invoke-WebRequest -Uri "$baseUrl/tasks/$taskId/move" -Method Put -Body $taskMoveBody -ContentType "application/json" -WebSession $session -Headers $headers -UseBasicParsing }

# 14. Reports Summary
$reports = Test-Endpoint "GET /reports/summary" 200 { Invoke-WebRequest -Uri "$baseUrl/reports/summary" -Method Get -WebSession $session -Headers $headers -UseBasicParsing }

# Cleanup
$deleteTask = Test-Endpoint "DELETE /tasks/$taskId" 200 { Invoke-WebRequest -Uri "$baseUrl/tasks/$taskId" -Method Delete -WebSession $session -Headers $headers -UseBasicParsing }
$deleteCol = Test-Endpoint "DELETE /columns/$colId" 200 { Invoke-WebRequest -Uri "$baseUrl/columns/$colId" -Method Delete -WebSession $session -Headers $headers -UseBasicParsing }

Write-Host "Testing complete."
