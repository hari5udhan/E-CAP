import { User } from "./../models/user";
import { environment } from "./../../environments/environment";
import { Injectable } from "@angular/core";
import { Amplify, Auth } from "aws-amplify";
import { HttpClient, HttpHeaders } from "@angular/common/http";
const AWS = require("aws-sdk");
AWS.config.update({ region: "ap-south-1" });
const CognitoIdentity = new AWS.CognitoIdentity();

const URL: any = "https://f1jui7bwae.execute-api.ap-south-1.amazonaws.com";
const ADMIN_URL: any =
  "https://nq44elrsi7.execute-api.ap-south-1.amazonaws.com/test/";
const SKILLS_URL: any =
  "https://uej23k6k14.execute-api.ap-south-1.amazonaws.com/test/";
// const SKILLS_URL: any = "http://localhost:3000/test/";
const RDS_URL: any = "https://qicfcwtrua.execute-api.ap-south-1.amazonaws.com";
const FEDERATED_IDENTITY_POOL_ID: any =
  "ap-south-1:17dcd924-ef7d-4188-b379-0f9762fcdaf3";
const LOCAL_HOST: any = "http://localhost:3000";
// var ses = new AWS.SES({region: 'ap-south-1'});

// const CognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();
// const USER_POOL_ID: any='ap-south-1_bput5S2i8';
// const CLIENT_ID: any = '38jqq2gnb13163h4intu91nf5n';
// const OPEN_AI_KEY: any ='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';

@Injectable({
  providedIn: "root",
})
export class ApiService {
  constructor(private http: HttpClient) {
    Amplify.configure({
      Auth: environment.userCognito,
    });
  }
  ////////////////////////////////////////////////////////////////////////////////////////////*   Download, upload and get RDS  */////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  reqestDownload() {
    let path = "download";
    let endpoint = SKILLS_URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
    });
    return this.http.get(endpoint, { headers: headers, responseType: "blob" });
  }

  upload(data: any) {
    let path = "training/bulk-approve";
    let endpoint = SKILLS_URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });

    return this.http.post(endpoint, data);
  }

  getRDS() {
    let path = "training/all";
    let endpoint = SKILLS_URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
      "Content-Type": "application/json",
    });

    return this.http.get<any>(endpoint, { headers: headers });
  }

  downloadDataInRange(data: any) {
    let path = "training/date";
    let endpoint = SKILLS_URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
      "Content-Type": "application/json",
    });

    return this.http.post(endpoint, data, {
      headers: headers,
      responseType: "blob",
    });
  }

  ////////////////////////////////////////////******-CRUD-OPERATIONS FOR CERTIFICATION-********/////////////////////////////////////////////////////////////////////////////////////////////
  addCertification(data: any) {
    let path = "certificateList";
    let endpoint = SKILLS_URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });
    let user: any;
    user = this.returnToken();
    let token: any;
    token = localStorage.getItem("id_token");
    headers.append("Authorization", token);
    headers.append("appUserName", user);

    return this.http.post<any>(endpoint, data, { headers: headers });
  }

  getCertifications(data: any) {
    let path = "certifications?username=" + data;
    let user = data;
    let endpoint = SKILLS_URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });

    let token: any;
    token = localStorage.getItem("id_token");
    headers.append("Authorization", token);
    headers = headers.append("appUserName", user);

    return this.http.get<any>(endpoint, { headers: headers });
  }

  updateCertifications(data: any, id: any) {
    let path = "certificateList/" + id;
    let endpoint = SKILLS_URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });
    let user: any;
    user = this.returnToken();
    let token: any;
    token = localStorage.getItem("id_token");
    headers.append("Authorization", token);
    headers = headers.append("appUserName", user);
    return this.http.post<any>(endpoint, data, { headers: headers });
  }

  deleteCertification(id: any) {
    let path = "certificateList/" + id;
    let endpoint = SKILLS_URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });
    let user: any;
    user = this.returnToken();
    let token: any;
    token = localStorage.getItem("id_token");
    headers.append("Authorization", token);
    headers = headers.set("appUserName", user);
    return this.http.delete<any>(endpoint, { headers: headers });
  }

  getAllCertifications(data: any) {
    let path = "certificateList";
    let user = data;
    user = localStorage.getItem("userId");
    let endpoint = SKILLS_URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });

    let token: any;
    token = localStorage.getItem("id_token");
    headers.append("Authorization", token);
    headers = headers.append("appUserName", user);

    return this.http.get<any>(endpoint, { headers: headers });
  }

  expiredCertification(
    certificateId: any,
    certificationName: any,
    certificateProvider: any
  ) {
    let user: any;
    user = this.returnToken();
    let path =
      "/test" +
      "/emailService?certificateId=" +
      certificateId +
      "&certificationName=" +
      certificationName +
      "&username=" +
      user +
      "&certificationProvider=" +
      certificateProvider;
    let endpoint = SKILLS_URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });
    let token: any;
    token = localStorage.getItem("id_token");
    headers.append("Authorization", token);
    headers.append("appUserName", user);
    return this.http.get<any>(endpoint, { headers: headers });
  }
  /////////////////////////////////////////////////////////////////////////////////EMPLOYEE CRUD OPERATIONS//////////////////////////////////////////////////////////////

  addEmployee(data: any) {
    let path = "employee";
    let endpoint = SKILLS_URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });
    let user: any;
    user = this.returnToken();
    let token: any;
    token = localStorage.getItem("id_token");
    headers.append("Authorization", token);
    headers.append("appUserName", user);

    return this.http.post<any>(endpoint, data, { headers: headers });
  }

  updateEmployeeServices(data: any) {
    let path = "employee/update/services";
    let endpoint = SKILLS_URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });
    let user: any;
    user = this.returnToken();
    let token: any;
    token = localStorage.getItem("id_token");
    headers.append("Authorization", token);
    headers = headers.append("appUserName", user);
    return this.http.post<any>(endpoint, data, { headers: headers });
  }

  updateEmployeeCourses(data: any) {
    let path = "employee/update/courses";
    let endpoint = SKILLS_URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });
    let user: any;
    user = this.returnToken();
    let token: any;
    token = localStorage.getItem("id_token");
    headers.append("Authorization", token);
    headers = headers.append("appUserName", user);
    return this.http.post<any>(endpoint, data, { headers: headers });
  }

  updateEmployeeTaskOnClear(data: any) {
    let path = "employee/task/CL";
    let endpoint = SKILLS_URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });
    let user: any;
    user = this.returnToken();
    let token: any;
    token = localStorage.getItem("id_token");
    headers.append("Authorization", token);
    headers = headers.append("appUserName", user);
    return this.http.post<any>(endpoint, data, { headers: headers });
  }

  updateEmployeeTaskOnNotClear(data: any) {
    let path = "employee/task/NC";
    let endpoint = SKILLS_URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });
    let user: any;
    user = this.returnToken();
    let token: any;
    token = localStorage.getItem("id_token");
    headers.append("Authorization", token);
    headers = headers.append("appUserName", user);
    return this.http.post<any>(endpoint, data, { headers: headers });
  }

  deleteEmployee(mail: any) {
    let path = "employeeData/" + mail;
    let endpoint = SKILLS_URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });
    let user: any;
    user = this.returnToken();
    let token: any;
    token = localStorage.getItem("id_token");
    headers.append("Authorization", token);
    headers = headers.set("appUserName", user);
    return this.http.delete<any>(endpoint, { headers: headers });
  }

  getEmployeeDetails(id: any) {
    let path = "employee/" + id;
    let endpoint = SKILLS_URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });
    let user: any;
    user = this.returnToken();
    let token: any;
    token = localStorage.getItem("id_token");
    headers.append("Authorization", token);
    headers = headers.set("appUserName", user);
    return this.http.get<any>(endpoint, { headers: headers });
  }
  getAllEmployee() {
    let path = "employee";
    let endpoint = SKILLS_URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });
    let user: any;
    user = this.returnToken();
    let token: any;
    token = localStorage.getItem("id_token");
    headers.append("Authorization", token);
    headers.append("appUserName", user);
    return this.http.get<any>(endpoint, { headers: headers });
  }

  requestSkillApproval(data: any) {
    let path = "employee/skillApproval/request";
    let endpoint = SKILLS_URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });
    let user: any;
    user = this.returnToken();
    let token: any;
    token = localStorage.getItem("id_token");
    headers.append("Authorization", token);
    headers.append("appUserName", user);
    return this.http.post<any>(endpoint, data, { headers: headers });
  }

  getSkillApprovalRequests() {
    let path = "employee/skillapproval";
    let endpoint = SKILLS_URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });
    let user: any;
    user = this.returnToken();
    let token: any;
    token = localStorage.getItem("id_token");
    headers.append("Authorization", token);
    headers.append("appUserName", user);
    return this.http.get<any>(endpoint, { headers: headers });
  }

  rejectSkillApprovalRequest(mail: any) {
    let path = "employee/skillapproval/reject/" + mail;
    let endpoint = SKILLS_URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });
    let user: any;
    user = this.returnToken();
    let token: any;
    token = localStorage.getItem("id_token");
    headers.append("Authorization", token);
    headers = headers.set("appUserName", user);
    return this.http.delete<any>(endpoint, { headers: headers });
  }

  approveSkillApprovalRequest(data: any) {
    let path = "employee/skillapproval/approve";
    let endpoint = SKILLS_URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });
    let user: any;
    user = this.returnToken();
    let token: any;
    token = localStorage.getItem("id_token");
    headers.append("Authorization", token);
    headers = headers.append("appUserName", user);
    return this.http.post<any>(endpoint, data, { headers: headers });
  }

  updateUncompletedCourses(data: any, mail: any) {
    let path = "employee/skill-gap/" + mail;
    let endpoint = SKILLS_URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });
    return this.http.post<any>(endpoint, data, { headers: headers });
  }
  /////////////////////////////////////////////////////////////////////////////////Other User CRUD/////////////////////////////////////////////////////////////////
  addUser(data: any) {
    let path = "userData";
    let endpoint = ADMIN_URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });
    let user: any;
    user = this.returnToken();
    let token: any;
    token = localStorage.getItem("id_token");
    headers.append("Authorization", token);
    headers.append("appUserName", user);

    return this.http.post<any>(endpoint, data, { headers: headers });
  }

  // other user delete
  userDelete(id: any) {
    let path = "userData/" + id;
    let endpoint = ADMIN_URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });
    let user: any;
    user = this.returnToken();
    let token: any;
    token = localStorage.getItem("id_token");
    headers.append("Authorization", token);
    headers = headers.set("appUserName", user);
    return this.http.delete<any>(endpoint, { headers: headers });
  }

  getOtherUsers() {
    let path = "userData";
    let endpoint = ADMIN_URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });
    let user: any;
    user = this.returnToken();
    let token: any;
    token = localStorage.getItem("id_token");
    headers.append("Authorization", token);
    headers.append("appUserName", user);
    return this.http.get<any>(endpoint, { headers: headers });
  }
  /////////////////////////////////////////////////////////////////////////////////**TRAINING REQUEST**//////////////////////////////////////////////////////////////
  requestTraining(data: any) {
    let path = "training/req";
    let endpoint = SKILLS_URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });
    let user: any;
    user = this.returnToken();
    let token: any;
    token = localStorage.getItem("id_token");
    headers.append("Authorization", token);
    headers.append("appUserName", user);

    return this.http.post<any>(endpoint, data, { headers: headers });
  }
  approveTraingReq(data: any) {
    let path = "training/req/approve";
    let endpoint = SKILLS_URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });
    let user: any;
    user = this.returnToken();
    let token: any;
    token = localStorage.getItem("id_token");
    headers.append("Authorization", token);
    headers.append("appUserName", user);

    return this.http.post<any>(endpoint, data, { headers: headers });
  }

  getTrainingRequests() {
    let path = "training/all";
    let user: any;
    user = this.returnToken();
    let endpoint = SKILLS_URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });

    let token: any;
    token = localStorage.getItem("id_token");
    headers.append("Authorization", token);
    headers = headers.append("appUserName", user);

    return this.http.get<any>(endpoint, { headers: headers });
  }
  getUserSpecificTrain(data: any) {
    let path = "trainingListUser?username=" + data;
    let user: any;
    user = this.returnToken();
    let endpoint = SKILLS_URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });

    let token: any;
    token = localStorage.getItem("id_token");
    headers.append("Authorization", token);
    headers = headers.append("appUserName", user);

    return this.http.get<any>(endpoint, { headers: headers });
  }

  getPendingTrainingRequests() {
    let path = "newTrainingRequests";
    let user: any;
    user = this.returnToken();
    let endpoint = SKILLS_URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });

    let token: any;
    token = localStorage.getItem("id_token");
    headers.append("Authorization", token);
    headers = headers.append("appUserName", user);

    return this.http.get<any>(endpoint, { headers: headers });
  }
  ////////////////////////////////////////////////////////////////////////////////ADMIN SERVICES////////////////////////////////////////////////////////////////////////
  // request for deletion
  requestDeletion(data: any) {
    let path = "certifications/delete-request";
    let endpoint = SKILLS_URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });
    let user: any;
    user = this.returnToken();
    let token: any;
    token = localStorage.getItem("id_token");
    headers.append("Authorization", token);
    headers.append("appUserName", user);

    return this.http.post<any>(endpoint, data, { headers: headers });
  }
  // admin aproves delete req
  adminDelete(id: any) {
    let user: any;
    user = this.returnToken();
    let path = "requests/" + id + "?username=" + user;
    let endpoint = SKILLS_URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });

    let token: any;
    token = localStorage.getItem("id_token");
    headers.append("Authorization", token);
    headers = headers.set("appUserName", user);
    return this.http.delete<any>(endpoint, { headers: headers });
  }

  getRequests(data: any) {
    let path = "requests";
    let user = data;
    user = localStorage.getItem("userId");
    let endpoint = SKILLS_URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });

    let token: any;
    token = localStorage.getItem("id_token");
    headers.append("Authorization", token);
    headers = headers.append("appUserName", user);

    return this.http.get<any>(endpoint, { headers: headers });
  }
  ////////////////////////////////////////////////////////////////////////////////////// GET CERTIFICATIONS COUNT ///////////////////////////////////////////////////////////
  getAWS() {
    let path = "certificateProviders";
    let certification = "Amazon Web Service(AWS)";
    let endpoint =
      SKILLS_URL + path + "?certificationProvider=" + certification;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });
    let token: any;
    token = localStorage.getItem("id_token");
    headers.append("Authorization", token);
    let user: any;
    user = this.returnToken();
    headers = headers.append("appUserName", user);
    return this.http.get<any>(endpoint, { headers: headers });
  }

  getAzure() {
    let path = "certificateProviders";
    let certification = "Microsoft Azure";
    let endpoint =
      SKILLS_URL + path + "?certificationProvider=" + certification;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });
    let token: any;
    token = localStorage.getItem("id_token");
    headers.append("Authorization", token);
    let user: any;
    user = this.returnToken();
    headers = headers.append("appUserName", user);
    return this.http.get<any>(endpoint, { headers: headers });
  }

  getGcp() {
    let path = "certificateProviders";
    let certification = "Google Cloud Platform(GCP)";
    let endpoint =
      SKILLS_URL + path + "?certificationProvider=" + certification;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });
    let token: any;
    token = localStorage.getItem("id_token");
    headers.append("Authorization", token);
    let user: any;
    user = this.returnToken();
    headers = headers.append("appUserName", user);
    return this.http.get<any>(endpoint, { headers: headers });
  }
  getOther() {
    let path = "certificateProviders";
    let certification = "Other";
    let endpoint =
      SKILLS_URL + path + "?certificationProvider=" + certification;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });
    let token: any;
    token = localStorage.getItem("id_token");
    headers.append("Authorization", token);
    let user: any;
    user = this.returnToken();
    headers = headers.append("appUserName", user);
    return this.http.get<any>(endpoint, { headers: headers });
  }

  public async verifyUser(data: any) {
    let path = "/test" + "/email";
    let endpoint = URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });
    let token: any;
    token = localStorage.getItem("id_token");
    let user: any;
    user = localStorage.getItem("userId");
    headers.append("Authorization", token);
    headers = headers.append("appUserName", user);
    return this.http.post<any>(endpoint, data, { headers: headers });
  }

  ////////////////////////////////////////////******-SIGNUP-LOGIN-SET Credentials locally-********//////////////////////////////////////////////////////////////////////////
  getIdToken() {
    return localStorage.getItem("id_token");
  }

  returnToken() {
    return localStorage.getItem("userId");
  }

  public signUp(user: User): Promise<any> {
    return Auth.signUp({
      username: user.email,
      password: user.password,
      attributes: {
        family_name: user.lname,
        given_name: user.fname,
        email: user.email,
      },
    });
  }

  public async confirmLogin(user: User): Promise<any> {
    await Auth.confirmSignUp(user.email, user.code);
  }

  public async logIn(user: User): Promise<any> {
    let CognitoUser = await Auth.signIn(user.email, user.password);

    let id_token = (await Auth.currentSession()).getIdToken().getJwtToken();
    await this.getIdentityId(id_token);
  }

  public async logOut(user: User): Promise<any> {
    localStorage.removeItem("id_token");
    localStorage.removeItem("aws");
    localStorage.removeItem("userId");
    await Auth.signOut();
  }

  public async forgotPassword(user: User): Promise<any> {
    return Auth.forgotPassword(user.email);
  }

  public async forgotPasswordSubmit(
    user: User,
    new_password: string
  ): Promise<any> {
    return Auth.forgotPasswordSubmit(user.email, user.code, new_password);
  }

  public async updateUser(user: User) {
    const Cuser = await Auth.currentAuthenticatedUser();
    await Auth.updateUserAttributes(Cuser, {
      family_name: user.lname,
      given_name: user.fname,
    });
  }

  public async adminUserDelete() {
    return Auth.deleteUser();
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////********-COGNITO CREDENTIALS-*******/////////////////////////////////////////////////////////////////////////////////////////////////
  async getIdentityId(idToken: any) {
    const params = {
      IdentityPoolId: FEDERATED_IDENTITY_POOL_ID,
      Logins: {
        "cognito-idp.ap-south-1.amazonaws.com/ap-south-1_HtjKHAtmo": idToken,
      },
    };
    let data = await CognitoIdentity.getId(params).promise();
    console.log("IdentityId" + data.IdentityId);

    const newparams = {
      IdentityId: data.IdentityId,
      Logins: {
        "cognito-idp.ap-south-1.amazonaws.com/ap-south-1_HtjKHAtmo": idToken,
      },
    };
    data = await CognitoIdentity.getCredentialsForIdentity(newparams).promise();
    localStorage.setItem("id_token", idToken);
    localStorage.setItem("aws", JSON.stringify(data));
    var token = idToken;
    var decode = token.split(".")[1];
    var decoded = JSON.parse(window.atob(decode));
    console.log(decoded.email);
    localStorage.setItem("userId", decoded.email);
  }
  ////////////////////////////////////////////////////////////////////////////////////GET USER COUNT AND DELETE USER ADMIN TASK'S/////////////////////////////////////////////////////
  getUser() {
    let path = "cognito/user";
    let endpoint = SKILLS_URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });
    let token: any;
    let data: any;
    data = localStorage.getItem("userId");
    token = localStorage.getItem("id_token");
    headers.append("Authorization", token);
    headers = headers.append("appUserName", data);
    return this.http.get<any>(endpoint, { headers: headers });
  }

  deleteCognitoUser(username: any) {
    let path = "cognito/user/" + username;
    let endpoint = SKILLS_URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });
    let token: any;
    let data: any;
    data = localStorage.getItem("userId");
    token = localStorage.getItem("id_token");
    headers.append("Authorization", token);
    headers = headers.append("appUserName", data);
    return this.http.get<any>(endpoint, { headers: headers });
  }

  ///////////////////////////////////////////////////////////////////////////////////////SKILL CLUSTER//////////////////////////////////////////////////////////
  getSkills() {
    let path = "skills";
    let endpoint = SKILLS_URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });
    return this.http.get(endpoint, { headers: headers });
  }

  getCourses(skill: any) {
    let path = "course/" + skill;
    let endpoint = SKILLS_URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });
    return this.http.get<any>(endpoint, { headers: headers });
  }

  updateCourses(data: any, skill: any) {
    let path = "skill/" + skill;
    let endpoint = SKILLS_URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });
    return this.http.post(endpoint, data, { headers: headers });
  }

  addNewSkills(data: any) {
    let path = "skill";
    let endpoint = SKILLS_URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });
    return this.http.post(endpoint, data, { headers: headers });
  }

  deleteSkills(skill: any) {
    let path = "skill/" + skill;
    let endpoint = SKILLS_URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });
    return this.http.delete(endpoint, { headers: headers });
  }

  getCourseTable() {
    let path = "courseTable";
    let endpoint = SKILLS_URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });
    return this.http.get(endpoint, { headers: headers });
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  addNewProject(data: any) {
    let path = "projects";
    let endpoint = SKILLS_URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });
    return this.http.post(endpoint, data, { headers: headers });
  }

  updateStatus(data: any) {
    let path = "projects/status";
    let endpoint = SKILLS_URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });
    return this.http.post(endpoint, data, { headers: headers });
  }

  updateProject(data: any, name: any) {
    let path = "projects/" + name;
    let endpoint = SKILLS_URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });
    return this.http.post(endpoint, data, { headers: headers });
  }

  deleteProject(name: any) {
    let path = "projects/" + name;
    let endpoint = SKILLS_URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });
    return this.http.delete(endpoint, { headers: headers });
  }

  getAllProjects(status: any) {
    let path = "projects?status=" + status;
    let endpoint = SKILLS_URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });
    return this.http.get(endpoint, { headers: headers });
  }

  getProjectName(name: any) {
    let path = "projects/name?name=" + name;
    let endpoint = SKILLS_URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });
    return this.http.get(endpoint, { headers: headers });
  }

  assignProject(data: any) {
    let path = "projects/assign";
    let endpoint = SKILLS_URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });
    return this.http.post(endpoint, data, { headers: headers });
  }

  requestCompletion(data: any) {
    let path = "projects/completion";
    let endpoint = SKILLS_URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });
    return this.http.post(endpoint, data, { headers: headers });
  }

  approveCompletion(data: any) {
    let path = "projects/approve";
    let endpoint = SKILLS_URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });
    return this.http.post(endpoint, data, { headers: headers });
  }

  rejectCompletion(data: any) {
    let path = "projects/reject";
    let endpoint = SKILLS_URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });
    return this.http.post(endpoint, data, { headers: headers });
  }

  getCompletionRequests() {
    let path = "projects/completion";
    let endpoint = SKILLS_URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });
    return this.http.get(endpoint, { headers: headers });
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  addNewTask(data: any) {
    let path = "task";
    let endpoint = SKILLS_URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });
    return this.http.post(endpoint, data, { headers: headers });
  }

  getQuestions(skill: any) {
    let path = "task/" + skill;
    let endpoint = SKILLS_URL + path;
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, POST, DELETE, GET, OPTIONS",
    });
    return this.http.get(endpoint, { headers: headers });
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}
