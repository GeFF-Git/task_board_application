$ErrorActionPreference = "Stop"

$baseUrl = "http://localhost:3000/api/v1"
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession

# Helper
function Check { param($res, $name) if ($res.StatusCode -match "20[014]") { Write-Host "[PASS] $name" } else { Write-Host "[FAIL] $name - Status $($res.StatusCode)" } }

Write-Host "--- Start Flat Tests ---"
# CSRF
$r = Invoke-WebRequest -Uri "$baseUrl/csrf/token" -Method Get -WebSession $session -UseBasicParsing
Check $r "GET CSRF"

$csrfCookieObj = $session.Cookies.GetCookies("http://localhost:3000") | Where-Object Name -eq "taskboard_csrf"
$csrfCookie = $csrfCookieObj.Value
$headers = @{}
if ($csrfCookie) { $headers["X-CSRF-TOKEN"] = $csrfCookie }

# Register maybe? user1@test.com already exists. Just login.
$body = @{ email="user1@test.com"; password="Password123!"; rememberMe=$true } | ConvertTo-Json
$r = Invoke-WebRequest -Uri "$baseUrl/auth/login" -Method Post -Body $body -ContentType "application/json" -WebSession $session -Headers $headers -UseBasicParsing
Check $r "POST Login"

$r = Invoke-WebRequest -Uri "$baseUrl/auth/me" -Method Get -WebSession $session -Headers $headers -UseBasicParsing
Check $r "GET Auth Me"

$body = @{ name="Flat Test Col" } | ConvertTo-Json
$r = Invoke-WebRequest -Uri "$baseUrl/columns" -Method Post -Body $body -ContentType "application/json" -WebSession $session -Headers $headers -UseBasicParsing
Check $r "POST Columns"
$colId = (ConvertFrom-Json $r.Content).data.id

$r = Invoke-WebRequest -Uri "$baseUrl/columns" -Method Get -WebSession $session -Headers $headers -UseBasicParsing
Check $r "GET Columns"

$body = @{ name="Flat Update Col" } | ConvertTo-Json
$r = Invoke-WebRequest -Uri "$baseUrl/columns/$colId" -Method Put -Body $body -ContentType "application/json" -WebSession $session -Headers $headers -UseBasicParsing
Check $r "PUT Columns"

$body = @( @{ id=$colId; order=1 } ) | ConvertTo-Json
$r = Invoke-WebRequest -Uri "$baseUrl/columns/reorder" -Method Patch -Body $body -ContentType "application/json" -WebSession $session -Headers $headers -UseBasicParsing
Check $r "PATCH Columns Reorder"

$body = @{ title="Flat Task"; description="Desc"; columnId=$colId } | ConvertTo-Json
$r = Invoke-WebRequest -Uri "$baseUrl/tasks" -Method Post -Body $body -ContentType "application/json" -WebSession $session -Headers $headers -UseBasicParsing
Check $r "POST Tasks"
$taskId = (ConvertFrom-Json $r.Content).data.id

$r = Invoke-WebRequest -Uri "$baseUrl/tasks" -Method Get -WebSession $session -Headers $headers -UseBasicParsing
Check $r "GET Tasks"

$r = Invoke-WebRequest -Uri "$baseUrl/tasks/$taskId" -Method Get -WebSession $session -Headers $headers -UseBasicParsing
Check $r "GET Single Task"

$body = @{ title="Upd Task"; description="Desc2"; columnId=$colId; status="In Progress" } | ConvertTo-Json
$r = Invoke-WebRequest -Uri "$baseUrl/tasks/$taskId" -Method Put -Body $body -ContentType "application/json" -WebSession $session -Headers $headers -UseBasicParsing
Check $r "PUT Tasks"

# Move task
$body = @{ columnId=$colId; previousTaskId=$null } | ConvertTo-Json
$r = Invoke-WebRequest -Uri "$baseUrl/tasks/$taskId/move" -Method Patch -Body $body -ContentType "application/json" -WebSession $session -Headers $headers -UseBasicParsing
Check $r "PATCH Tasks Move"

$r = Invoke-WebRequest -Uri "$baseUrl/reports/summary" -Method Get -WebSession $session -Headers $headers -UseBasicParsing
Check $r "GET Reports Summary"

$r = Invoke-WebRequest -Uri "$baseUrl/tasks/$taskId" -Method Delete -WebSession $session -Headers $headers -UseBasicParsing
Check $r "DELETE Tasks"

$r = Invoke-WebRequest -Uri "$baseUrl/columns/$colId" -Method Delete -WebSession $session -Headers $headers -UseBasicParsing
Check $r "DELETE Columns"

Write-Host "--- End Flat Tests ---"
