import LoginForm from "../Components/Login";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";

function Page1() {
  return (
    <Grid container direction="row" justify="center" alignItems="center">
      <Grid item container xs={12}>
        <LoginForm />
      </Grid>
    </Grid>
  );
}

export default Page1;
