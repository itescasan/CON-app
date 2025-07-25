export class Conexion {

     /*private IP : string = "localhost";
      private PORT : String =  "7193";
      public Timeout : number = 30000;

    
      Url() : string{
          return "https://"+this.IP+":"+this.PORT+"/api/"; 
      }*/
 
     private IP : string = "165.98.96.131";
      private PORT : String =  "160";
      public Timeout : number = 30000;



      Url() : string{
          return "http://"+this.IP+":"+this.PORT+"/api/"; 
      }


}