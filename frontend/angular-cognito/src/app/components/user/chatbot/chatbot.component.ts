import { HttpClient } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "src/app/services/api.service";
import { Auth } from "aws-amplify";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { RsiIndicator } from "@syncfusion/ej2-angular-charts";

@Component({
  selector: "app-chatbot",
  templateUrl: "./chatbot.component.html",
  styleUrls: ["./chatbot.component.css"],
})
export class ChatbotComponent implements OnInit {
  isChatBox: boolean = false;
  isChatButton: boolean = true;
  isInput: boolean = false;
  isOptions: boolean = true;
  isSelection: boolean = false;
  addedCertificates: any;
  newMessage: string = "";
  email: string = "";
  name: string = "";
  chatHistory: { text: any; isUser: any }[] = [];
  chat: any = [];
  trimedMessage: any;
  count: number = 0;
  displayedColumns: string[] = [
    "certificationProvider",
    "certificationLevel",
    "certificationName",
    "certificateId",
    "dateOfCertification",
    "dateOfExpiry",
    "validity",
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private http: HttpClient, public api: ApiService) {}
  ngOnInit(): void {
    this.getAllCertifications();
  }

  sendMessage(message: string) {
    this.chatHistory.push({ text: message, isUser: "You" });
    this.chat.push("Q: " + message);
    this.newMessage = "";
    this.http
      .get(
        "https://paveczij7a.execute-api.ap-south-1.amazonaws.com/dev/?prompt=" +
          this.chat
      )
      .subscribe((response) => {
        const botMessage = response;
        if (typeof response === "string") {
          this.trimedMessage = response.replace("A: ", "");
        }
        this.chatHistory.push({ text: this.trimedMessage, isUser: "Bot" });
        this.chat.push(response);
      });
  }
  onClick() {
    this.isChatButton = false;
    this.isChatBox = true;
    this.chatHistory.push({
      text: "Welcome, " + this.name + ". Select an option to Proceed",
      isUser: "Bot",
    });
  }
  closeChat() {
    this.isChatButton = true;
    this.isChatBox = false;
  }

  getAllCertifications = async () => {
    const { attributes } = await Auth.currentAuthenticatedUser();
    this.email = attributes["email"];
    this.name = attributes["given_name"] + attributes["family_name"];
    // console.log(attributes)
    this.api.getCertifications(this.email).subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.Items);
        // console.log(res.Items)
        if (res.Count == 0) {
          this.addedCertificates =
            "I am an beginer in cloud computing. Suggest me best certification?";
        } else {
          this.count = res.Count - 1;
          var certificate =
            res.Items[this.count].certificationProvider +
            " " +
            res.Items[this.count].certificationName +
            "-" +
            res.Items[this.count].certificationLevel;
          this.addedCertificates = certificate;
        }
        // console.log(this.addedCertificates);
      },
      error: (err) => {
        console.log(err);
      },
    });
  };
  onSuggest() {
    this.isInput = true;
    this.isOptions = false;
    const prompt =
      "Iam" +
      this.addedCertificates +
      "," +
      "suggest me next higher level certification to this in next higher level, just say the certification name";
    this.chat.push("Q: " + prompt);
    this.chatHistory.push({
      text: "Suggest Next Level of Certification",
      isUser: "You",
    });
    this.newMessage = "";
    this.http
      .get(
        "https://kjvpw8pxn8.execute-api.ap-south-1.amazonaws.com/dev/?prompt=" +
          this.chat
      )
      .subscribe((response) => {
        const botMessage = response;
        if (typeof response === "string") {
          this.trimedMessage = response.replace("A: ", "");
        }
        this.chatHistory.push({ text: this.trimedMessage, isUser: "Bot" });
        this.chat.push(response);
      });
  }

  onGamePlay() {
    this.isInput = true;
    this.isOptions = false;
    this.chatHistory.push({ text: "Game Play", isUser: "You" });
    this.chatHistory.push({ text: "Select an topic below:", isUser: "Bot" });
    this.isSelection = true;
  }

  onSelect(topic: any) {
    this.isSelection = false;
    this.chatHistory.push({ text: topic, isUser: "You" });
    const prompt =
      "The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.Topic is " +
      topic +
      ". I will give the topic and then start with questions. Ask me questions one by one after I give a correct answer. Level 1 of 5 questions and Level 2 of 5 questions. Both should be MCQ types with 4 choices. Level 3 should be a practical task with one.";
    this.http
      .get(
        "https://kjvpw8pxn8.execute-api.ap-south-1.amazonaws.com/dev/?prompt=" +
          prompt
      )
      .subscribe((response) => {
        this.newMessage = " ";
        const botMessage = response;
        this.chatHistory.push({ text: botMessage, isUser: "Bot" });
      });
  }

  onChat() {
    this.isInput = true;
    this.isOptions = false;
    this.chatHistory.push({ text: "Chat", isUser: "You" });
    this.chat.push(
      'I am a highly intelligent question answering bot. If you ask me a question that is rooted in truth, I will give you the answer. If you ask me a question that is nonsense, trickery, or has no clear answer, I will respond with "Unknown".'
    );
    // this.chat.push( 'AI: '+'Hello, '+ this.name + '.\n How can I help you today?');
    this.chatHistory.push({
      text: "Hello, " + this.name + ".\n How can I help you today?",
      isUser: "Bot",
    });
  }
}
