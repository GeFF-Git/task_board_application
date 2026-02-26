import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app';
import { Router } from '@angular/router';
import { ThemeStore } from '@features/theme-toggle/theme.store';
import { signal } from '@angular/core';
import { Component } from '@angular/core';
import { SidebarComponent } from '@widgets/sidebar/sidebar.component';
import { TopbarComponent } from '@widgets/topbar/topbar.component';

@Component({ selector: 'app-sidebar', standalone: true, template: '' })
class MockSidebarComponent {}

@Component({ selector: 'app-topbar', standalone: true, template: '' })
class MockTopbarComponent {}

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let mockRouter: any;
  let mockThemeStore: any;

  beforeEach(async () => {
    mockRouter = { url: '/task-board' };
    mockThemeStore = {
      isDarkMode: signal(true),
      toggle: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [AppComponent, MockSidebarComponent, MockTopbarComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ThemeStore, useValue: mockThemeStore },
      ],
    })
    .overrideComponent(AppComponent, {
      remove: { imports: [SidebarComponent, TopbarComponent] },
      add: { imports: [MockSidebarComponent, MockTopbarComponent] }
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should return true for isStandaloneRoute when url is /login', () => {
    mockRouter.url = '/login';
    expect(component.isStandaloneRoute()).toBe(true);
  });

  it('should return true for isStandaloneRoute when url is /signup', () => {
    mockRouter.url = '/signup';
    expect(component.isStandaloneRoute()).toBe(true);
  });

  it('should return false for isStandaloneRoute for other urls', () => {
    mockRouter.url = '/task-board';
    expect(component.isStandaloneRoute()).toBe(false);
  });
});
