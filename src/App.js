import React, { useState } from "react";
import "./App.css";
import { makeStyles } from "@material-ui/core/styles";
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  FormControl,
  Card,
  CardContent,
  FormHelperText,
  Input,
  InputLabel,
  Grid,
  Slider,
  Button,
} from "@material-ui/core";
import { Brightness4, Brightness5 } from "@material-ui/icons";

import Axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  card: {
    maxWidth: "40vw",
  },
  paragraph: {
    marginBlockStart: 0,
    marginBlockEnd: 0,
  },
  title: {
    flexGrow: 1,
    fontSize: 14,
  },
}));

function App() {
  const classes = useStyles();
  const url = "http://mk-cideng.ddns.net:5003";
  const [contrast, setValue] = useState(0);
  const [result, setResult] = useState("Result will show here");
  const [data, setData] = useState("");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const prosesOcr = async () => {
    setData("");
    const input = document.getElementById("fileInput").files;
    if (input.length === 1 && contrast) {
      try {
        setResult("Uploading file..");
        const formData = new FormData();
        for (var i = 0; i !== input.length; i++) {
          formData.append("files", input[i]);
        }
        const response = await Axios({
          url: `${url}/ConsoleOCR/Upload`,
          method: "POST",
          data: formData,
        });
        if (response.status === 200) {
          setResult("Upload success..");
          const { getname } = response.data;
          try {
            setResult("Scanning KTP..");
            const responseOcr = await Axios({
              url: `${url}/api/GetOCR/GetNewOCRURL`,
              method: "POST",
              data: { direktori: getname, contrast },
            });
            if (responseOcr.status === 200) {
              const { data } = responseOcr;
              setResult("");
              setData({
                provinsi: data[0],
                kota: data[1],
                nik: data[2],
                nama: data[3],
                jk: data[4],
                ttl: data[5],
                alamat: `${data[6]} ${data[7]} ${data[8]} ${data[9]} ${data[10]}`,
                kawin: data[12],
                pekerjaan: data[13],
                agama: data[11],
                berlaku: data[15],
              });
            }
          } catch (error) {
            setResult(error.message);
          }
        }
      } catch (error) {
        setResult(error.message);
      }
    } else if (contrast === 0) {
      setResult("Please set proper contrast");
    } else {
      setResult("Please input required file");
    }
  };

  const dataOutput = (data) => {
    return (
      <>
        <p className={classes.paragraph}>{data.provinsi}</p>
        <p className={classes.paragraph}>{data.kota}</p>
        <p className={classes.paragraph}>{data.nik}</p>
        <p className={classes.paragraph}>{data.nama}</p>
        <p className={classes.paragraph}>{data.jk}</p>
        <p className={classes.paragraph}>{data.ttl}</p>
        <p className={classes.paragraph}>{data.alamat}</p>
        <p className={classes.paragraph}>{data.kawin}</p>
        <p className={classes.paragraph}>{data.pekerjaan}</p>
        <p className={classes.paragraph}>{data.agama}</p>
        <p className={classes.paragraph}>{data.berlaku}</p>
      </>
    );
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5">OCR testing webpage</Typography>
        </Toolbar>
      </AppBar>
      <Container fixed>
        <br />
        <FormControl style={{ width: "40vw" }}>
          <Typography id="continuous-slider" gutterBottom>
            Contrast
          </Typography>
          <Grid container spacing={2}>
            <Grid item>
              <Brightness5 />
            </Grid>
            <Grid item xs md lg sm>
              <Slider
                value={contrast}
                onChange={handleChange}
                aria-labelledby="continuous-slider"
                valueLabelDisplay="auto"
              />
            </Grid>
            <Grid item>
              <Brightness4 />
            </Grid>
          </Grid>
        </FormControl>
        <br />
        <Grid container spacing={2} justify="flex-start" alignItems="center">
          <Grid item>
            <FormControl>
              <InputLabel htmlFor="fileInput">File OCR</InputLabel>
              <Input
                id="fileInput"
                type="file"
                aria-describedby="my-helper-text"
              />
              <FormHelperText id="my-helper-text">
                Please input required file
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item>
            <Button color="primary" variant="contained" onClick={prosesOcr}>
              Scan
            </Button>
          </Grid>
        </Grid>

        <br />
        <br />
        <Card className={classes.card} variant="outlined">
          <CardContent>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
            >
              Result
            </Typography>
            <Typography variant="subtitle1">{result}</Typography>
            <Typography variant="subtitle1">
              {data && dataOutput(data)}
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}

export default App;
