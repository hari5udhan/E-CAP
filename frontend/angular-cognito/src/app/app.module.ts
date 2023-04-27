import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/user/view-certificates/view-certificate.component';
import { SideNavbarComponent } from './components/user/sideNavbar/sideNavbar.component';
import { SignupComponent } from './components/user/signup/signup.component';
import { LoginComponent } from './components/user/login/login.component';
import { CertificateRegisterationFormComponent } from './components/user/certificate-registeration-form/certificate-registeration-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MAT_DIALOG_DEFAULT_OPTIONS,
} from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTestDialogOpenerModule } from '@angular/material/dialog/testing';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { CertificatesComponent } from './components/user/home/home.component';
import { NavbarComponent } from './components/user/navbar/navbar.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import { DeleteRequestComponent } from './components/user/delete-request/delete-request.component';
import { AdminHomeComponent } from './components/admin/admin-home/admin-home.component';
import { AdminNavbarComponent } from './components/admin/admin-navbar/admin-navbar.component';
import { AdminViewCertificatesComponent } from './components/admin/admin-view-certificates/admin-view-certificates.component';
import { AdminDeleteRequestComponent } from './components/admin/admin-delete-request/admin-delete-request.component';
import { AdminUsersComponent } from './components/admin/admin-users/admin-users.component';
import { AccountDeleteRequestComponent } from './components/user/dialog/account-delete-request/account-delete-request.component';
import { AccountDeleteComponent } from './components/user/dialog/account-delete/account-delete.component';
import { ChatbotComponent } from './components/user/chatbot/chatbot.component';
import { SuggestionComponent } from './components/user/dialog/suggestion/suggestion.component';
import { NgChartsModule } from 'ng2-charts';
import { TrainingRequestComponent } from './components/user/dialog/training-request/training-request.component';
import { ViewTrainingRequestComponent } from './components/admin/view-training-request/view-training-request.component';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { EmployeeTableComponent } from './components/admin/employee-table/employee-table.component';
import { CognitoUserComponent } from './components/admin/cognito-user/cognito-user.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TrainingRecordsComponent } from './components/admin/training-records/training-records.component';
import { CourseComponent } from './components/admin/course/course.component';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { AddCourseComponent } from './components/admin/add-course/add-course.component';
import { SbuFormComponent } from './components/user/dialog/sbu-form/sbu-form.component';
import { SkillsEditComponent } from './components/user/dialog/skills-edit/skills-edit.component';
import { SkillApprovalComponent } from './components/admin/skill-approval/skill-approval.component';
import { ProjectSectionComponent } from './components/admin/project-section/project-section.component';
import { AddProjectComponent } from './components/admin/add-project/add-project.component';
import { AssignProjectformComponent } from './components/admin/assign-projectform/assign-projectform.component';
import { ProjectCompletionComponent } from './components/user/dialog/project-completion/project-completion.component';
import { HomePageComponent } from './components/user/home-page/home-page.component';
import { ModalPageComponent } from './components/user/dialog/modal-page/modal-page.component';
import { SkillAssignformComponent } from './components/admin/skill-assignform/skill-assignform.component';
import { TaskDialogComponent } from './components/user/task-section/task-dialog/task-dialog.component';
import { AddAssessmentsComponent } from './components/admin/assessments-section/add-assessments/add-assessments.component';
import { UpdateAssessmentsComponent } from './components/admin/assessments-section/update-assessments/update-assessments.component';
import { ToolbarComponent } from './components/admin/toolbar/toolbar.component';
import { TaskPageComponent } from './components/user/task-section/task-page/task-page.component';
import { SkillFormComponent } from './components/user/skill-form/skill-form.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SignupComponent,
    LoginComponent,
    CertificateRegisterationFormComponent,
    CertificatesComponent,
    SideNavbarComponent,
    NavbarComponent,
    ProfileComponent,
    DeleteRequestComponent,
    AdminHomeComponent,
    AdminNavbarComponent,
    AdminViewCertificatesComponent,
    AdminDeleteRequestComponent,
    AdminUsersComponent,
    AccountDeleteRequestComponent,
    AccountDeleteComponent,
    ChatbotComponent,
    SuggestionComponent,
    TrainingRequestComponent,
    ViewTrainingRequestComponent,
    EmployeeTableComponent,
    CognitoUserComponent,
    LandingPageComponent,
    TrainingRecordsComponent,
    CourseComponent,
    AddCourseComponent,
    SbuFormComponent,
    SkillsEditComponent,
    SkillApprovalComponent,
    ProjectSectionComponent,
    AddProjectComponent,
    AssignProjectformComponent,
    ProjectCompletionComponent,
    HomePageComponent,
    ModalPageComponent,
    SkillAssignformComponent,
    TaskDialogComponent,
    AddAssessmentsComponent,
    UpdateAssessmentsComponent,
    ToolbarComponent,
    TaskPageComponent,
    SkillFormComponent,
  ],
  imports: [
    HttpClientModule,
    MatIconModule,
    MatToolbarModule,
    BrowserAnimationsModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    MatDialogModule,
    MatInputModule,
    MatOptionModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatTableModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatFormFieldModule,
    NgChartsModule,
    MatSortModule,
    MatCheckboxModule,
    MatTabsModule,
    MatSnackBarModule,
    MatBadgeModule,
    NgbModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatInputModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    MatDatepickerModule,
    MatNativeDateModule,
    LoginComponent,
    HomeComponent,
    { provide: MatTestDialogOpenerModule, useValue: {} },
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } },
    { provide: MAT_DIALOG_DATA, useValue: {} },
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
