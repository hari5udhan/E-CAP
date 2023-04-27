import { SignupComponent } from "./components/user/signup/signup.component";
import { LoginComponent } from "./components/user/login/login.component";
import { HomeComponent } from "./components/user/view-certificates/view-certificate.component";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SideNavbarComponent } from "./components/user/sideNavbar/sideNavbar.component";
import { CertificatesComponent } from "./components/user/home/home.component";
import { ProfileComponent } from "./components/user/profile/profile.component";
import { AdminNavbarComponent } from "./components/admin/admin-navbar/admin-navbar.component";
import { AdminViewCertificatesComponent } from "./components/admin/admin-view-certificates/admin-view-certificates.component";
import { AdminDeleteRequestComponent } from "./components/admin/admin-delete-request/admin-delete-request.component";
import { AdminUsersComponent } from "./components/admin/admin-users/admin-users.component";
import { ChatbotComponent } from "./components/user/chatbot/chatbot.component";
import { ViewTrainingRequestComponent } from "./components/admin/view-training-request/view-training-request.component";
import { SuggestionComponent } from "./components/user/dialog/suggestion/suggestion.component";
import { LandingPageComponent } from "./components/landing-page/landing-page.component";
import { CourseComponent } from "./components/admin/course/course.component";
import { SkillApprovalComponent } from "./components/admin/skill-approval/skill-approval.component";
import { ProjectSectionComponent } from "./components/admin/project-section/project-section.component";
import { HomePageComponent } from "./components/user/home-page/home-page.component";
import { TaskPageComponent } from "./components/user/task-section/task-page/task-page.component";
import { SkillsEditComponent } from "./components/user/dialog/skills-edit/skills-edit.component";

const routes: Routes = [
  { path: "", component: LandingPageComponent },
  { path: "home", component: SideNavbarComponent },
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  { path: "welcome", component: CertificatesComponent },
  { path: "view", component: HomeComponent },
  { path: "admin-home", component: AdminNavbarComponent },
  { path: "certificates", component: AdminViewCertificatesComponent },
  { path: "requests", component: AdminDeleteRequestComponent },
  { path: "view-user", component: AdminUsersComponent },
  { path: "chatbot", component: ChatbotComponent },
  { path: "trainingRequests", component: ViewTrainingRequestComponent },
  { path: "suggest", component: SuggestionComponent },
  { path: "course", component: CourseComponent },
  { path: "skill", component: SkillApprovalComponent },
  { path: "admin-projects", component: ProjectSectionComponent },
  { path: "profile", component: HomePageComponent },
  { path: "task", component: TaskPageComponent },
  { path: "skillform", component: SkillsEditComponent },
  { path: "land", component: CertificatesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
