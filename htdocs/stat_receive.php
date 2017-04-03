<h2>Statistik Entgegennahme</h2>
<div>Tab sollte sich nach erfolgreicher Übertragung automatisch schließen. Wenden Sie sich bei Fehlern bitte an den Betreiber..</div>
<?php
  $servername = "localhost";
  $username = "root";
  $password = "";
  $dbname = "db_test";

  $conn = new mysqli($servername, $username, $password, $dbname);

  // Check connection
  if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
  }
  if(isset($_GET["s"])&&isset($_GET["p"])&&isset($_GET["a"])&&isset($_GET["pl"])){
    $server = $_GET["s"];
    $points = $_GET["p"];
    $action = $_GET["a"];
    $player = $_GET["pl"];
    if(is_int(intval($points))){
      echo "ok: ".intval($points);
    }else{
      echo "keine zahl";
    }
  }else{
    echo "Fehlende Eingaben";
  }


  $sql = "INSERT INTO stat (`server`, `points`, `action`, `player`) VALUES ('".$server."', '".$points."', '".$action."','".$player."')";

  if($server!=""&&$points!=""&&$action!=""){
      if ($conn->query($sql) === TRUE) {
          sleep(1);
          /*echo "<script>
             close();
          </script>";*/
      } else {
          echo "Error: " . $sql . "<br>" . $conn->error;
      }
  }
?>
