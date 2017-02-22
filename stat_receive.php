<h2>Statistik Entgegennahme</h2> 
<?php
  $servername = "localhost";
  $username = "root";
  $password = "";
  $dbname = "db_stat";

  $conn = new mysqli($servername, $username, $password, $dbname);

  // Check connection
  if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
  }
  $server = $_GET["s"];
  $points = $_GET["p"];
  $action = $_GET["a"];

  $sql = "INSERT INTO stat (`server`, `points`, `action`) VALUES ('".$server."', '".$points."', '".$action."')";

  if($server!=""&&$points!=""&&$action!=""){
      if ($conn->query($sql) === TRUE) {
          sleep(1);
          echo "<script>
             window.location.close();
          </script>";
      } else {
          echo "Error: " . $sql . "<br>" . $conn->error;
      }
  }
?>
