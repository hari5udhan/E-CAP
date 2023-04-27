import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StreamOrder } from 'aws-sdk/clients/mediapackage';

@Component({
  selector: 'app-suggestion',
  templateUrl: './suggestion.component.html',
  styleUrls: ['./suggestion.component.css']
})
export class SuggestionComponent implements OnInit{
  suggestedCertificate: string=''; clearedCertificate: string='';
  constructor(@Inject (MAT_DIALOG_DATA) public suggestData: any, private dialogref: MatDialogRef<SuggestionComponent>){}
  ngOnInit(): void {
    console.log(this.suggestData)
    this.getSuggestion();
  }

  getSuggestion(){
    if(this.suggestData.certificationLevel == 'Foundational'){
      if(this.suggestData.certificationProvider == 'Amazon Web Service(AWS)'){
          if(this.suggestData.certificationName== 'Cloud Practitioner'){
              this.suggestedCertificate= 'Developer';
          }
         
      } 
      else if(this.suggestData.certificationProvider == 'Google Cloud Platform(GCP)'){
        if(this.suggestData.certificationName=='Cloud Digital Leader'){
          this.suggestedCertificate= 'Cloud Engineer';
        }    
      }
      else{
        if(this.suggestData.certificationName=='Azure Fundamentals'){
          this.suggestedCertificate= 'Administrator Associate';
        }
      }
    }
    else if(this.suggestData.certificationLevel == 'Associate'){
      if(this.suggestData.certificationProvider == 'Amazon Web Service(AWS)'){
         if(this.suggestData.certificationName== 'Developer'){
          this.suggestedCertificate= 'SysOps Administrator';

        }
        else if(this.suggestData.certificationName== 'SysOps Administrator'){
          this.suggestedCertificate= 'Solutions Architect';

        }
        else {
          this.suggestedCertificate= 'Solutions Architect- Professional';

        }
      }
      else if(this.suggestData.certificationProvider == 'Google Cloud Platform(GCP)'){
        if(this.suggestData.certificationName=='Cloud Engineer'){
          this.suggestedCertificate= 'Cloud Architect';
        }
      }
      else{

      }
    }
    else if(this.suggestData.certificationLevel == 'Professional'){
      if(this.suggestData.certificationProvider == 'Amazon Web Service(AWS)'){

      }else if(this.suggestData.certificationProvider == 'Google Cloud Platform(GCP)'){
      if(this.suggestData.certificationName=='Cloud Database Engineer'){
          this.suggestedCertificate= 'Cloud Developer';
        }
        else{
          this.suggestedCertificate= 'Data Engineer';

        }
      }
      else{

      }
      

    }

    this.clearedCertificate= this.suggestData.certificationName;
  }
  
  onClose(){
    window.location.reload();
  }
}
