export class Conexion {

      private IP : string = "localhost";
      private PORT : String =  "7193";

    
      Url() : string{
          return "https://"+this.IP+":"+this.PORT+"/api/"; 
      }
 
     

<<<<<<< HEAD
      private IP : string = "165.98.96.131";
=======
     /*private IP : string = "165.98.96.131";
>>>>>>> cbf6f73 (fix fecha)
      private PORT : String =  "160";



      Url() : string{
          return "http://"+this.IP+":"+this.PORT+"/api/"; 
      }*/


}