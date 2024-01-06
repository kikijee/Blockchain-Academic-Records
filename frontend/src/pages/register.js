import * as React from 'react';
import {
  Avatar, Button, CssBaseline, TextField, Link, Grid, Box, Typography,
  Container, InputLabel, MenuItem, FormControl, Select, Snackbar, Stack,
  ThemeProvider, createTheme
} from '@mui/material';
import { signUpStudent, signUpInstitution } from '../service/authService';
import WidgetsIcon from '@mui/icons-material/Widgets';
import MuiAlert from '@mui/material/Alert';
import validator from 'validator';
import isEmail from 'validator/lib/isEmail';
import isStrongPassword from 'validator/lib/isStrongPassword'

const defaultTheme = createTheme();

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://www.csusm.edu/index.html">
        CSUSM
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function StudentForm({ formData, handleDataChange, inputFlags }) {
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            error={!inputFlags.firstNameFlag}
            autoComplete="given-name"
            name="firstname"
            required
            fullWidth
            id="firstname"
            label="First Name"
            autoFocus
            value={formData.firstname}
            onChange={handleDataChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            error={!inputFlags.lastNameFlag}
            required
            fullWidth
            id="lastname"
            label="Last Name"
            name="lastname"
            autoComplete="family-name"
            value={formData.lastname}
            onChange={handleDataChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            error={!inputFlags.emailFlag}
            required
            fullWidth
            id="email"
            label="Email Address (Must be a valid email format)"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleDataChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            error={!inputFlags.birthDayFlag}
            required
            fullWidth
            id="dateofbirth"
            label="Birth Date"
            name="dateofbirth"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            value={formData.dateofbirth}
            onChange={handleDataChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            error={!inputFlags.passwordFlag}
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleDataChange}
          />*Password must be 8 characters including 1 uppercase, lowercase, number, and special character.
        </Grid>
      </Grid>
    </>
  );
}

function InstitutionForm({ formData, handleDataChange, inputFlags }) {
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            error={!inputFlags.firstNameFlag}
            autoComplete="given-name"
            name="firstname"
            required
            fullWidth
            id="firstname"
            label="First Name"
            autoFocus
            value={formData.firstname}
            onChange={handleDataChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            error={!inputFlags.lastNameFlag}
            required
            fullWidth
            id="lastname"
            label="Last Name"
            name="lastname"
            autoComplete="family-name"
            value={formData.lastname}
            onChange={handleDataChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            error={!inputFlags.emailFlag}
            required
            fullWidth
            id="email"
            label="Email Address (Must be a valid email format)"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleDataChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            error={!inputFlags.birthDayFlag}
            required
            fullWidth
            id="dateofbirth"
            label="Birth Date"
            name="dateofbirth"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            value={formData.dateofbirth}
            onChange={handleDataChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            error={!inputFlags.schoolFlag}
            required
            fullWidth
            id="schoolname"
            label="School Name"
            name="schoolname"
            autoComplete="schoolname"
            value={formData.schoolname}
            onChange={handleDataChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            error={!inputFlags.addressFlag}
            required
            fullWidth
            id="address"
            label="School Address"
            name="address"
            autoComplete="address"
            value={formData.address}
            onChange={handleDataChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            error={!inputFlags.walletAddressFlag}
            required
            fullWidth
            id="walletaddress"
            label="Wallet Address"
            name="walletaddress"
            autoComplete="walletaddress"
            value={formData.walletaddress}
            onChange={handleDataChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            error={!inputFlags.passwordFlag}
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleDataChange}
          />*Password must be 8 characters including 1 uppercase, lowercase, number, and special character.
        </Grid>
      </Grid>
    </>
  );
}

export default function Register() {
  const [role, setRole] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [notificationStatus, setNotificationStatus] = React.useState(null);
  const [formData, setFormData] = React.useState({
    firstname: "",
    lastname: "",
    email: "",
    dateofbirth: "",
    schoolname: "",
    address: "",
    walletaddress: "",  // adding wallet address
    password: ""
  });
  const [inputFlags, setInputFlags] = React.useState({
    firstNameFlag: true,
    lastNameFlag: true,
    emailFlag: true,
    passwordFlag: true,
    birthDayFlag: true,
    schoolFlag: true,
    addressFlag: true,
    walletAddressFlag: true // adding wallet address
  });

const handleSubmit = async (event) => {
  event.preventDefault();

  // Check if any input flags are set to false
  const hasError = Object.values(inputFlags).some(flag => !flag);

  // If there's an error, don't submit
  if (hasError) {
    setOpen(true);
    setNotificationStatus(false);
    return;
  }

  //console.log(formData)

  const {
    firstname,
    lastname,
    email,
    dateofbirth,
    schoolname,
    address,
    password,
    walletaddress // adding wallet address
  } = formData;

    // Email and password validation
    if (!isEmail(email)) {
      setInputFlags(prevFlags => ({ ...prevFlags, emailFlag: false }));
      setOpen(true);
      setNotificationStatus(false);
      return;
    }
  
    if (!isStrongPassword(password)) {
      setInputFlags(prevFlags => ({ ...prevFlags, passwordFlag: false }));
      setOpen(true);
      setNotificationStatus(false);
      return;
    }
  let res;

  if (role === 'Institution') {
    if(!validator.isEmail(formData.email)){
      return handleSubmit
    }else if (!validator.isStrongPassword(formData.password)){
      return handleSubmit
    }
    res = await signUpInstitution({
      SchoolName: schoolname,
      Address: address,
      Email: email,
      WalletAddress: walletaddress, // adding wallet address
      FirstName: firstname,
      LastName: lastname,
      DateOfBirth: dateofbirth,
      AuthenticationData: password
    });
  } else if (role === 'Student') {
    res = await signUpStudent({
      Email: email,
      FirstName: firstname,
      LastName: lastname,
      DateOfBirth: dateofbirth,
      AuthenticationData: password
    });
  }

  // Check response status and update state 
  if (res && res.status === 201) {
    setNotificationStatus(true);
    resetForm();
    console.log(res);
  } else {
    setNotificationStatus(false);
  }

  setOpen(true);
};

const handleDataChange = (event) => {
  const { name, value } = event.target;
  setFormData(prevState => ({ ...prevState, [name]: value }));
  
  setInputFlags(prevFlags => ({ ...prevFlags, [`${name}Flag`]: true }));
};

  const resetForm = () => {
    setFormData({
      firstname: "",
      lastname: "",
      email: "",
      dateofbirth: "",
      schoolname: "",
      address: "",
      walletaddress:"", // adding wallet address
      password: ""
    });
    setInputFlags({
      firstNameFlag: true,
      lastNameFlag: true,
      emailFlag: true,
      passwordFlag: true,
      birthDayFlag: true,
      schoolFlag: true,
      walletAddressFlag: true, // adding wallet address
      addressFlag: true
    });
  };

return (
  <ThemeProvider theme={defaultTheme}>
    
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "#466b48" }}>
          <WidgetsIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box sx={{ minWidth: 120, marginTop: 5 }}>
        <FormControl variant="outlined" fullWidth>
            <InputLabel id="role-select-label" shrink={role ? true : false}>User Type</InputLabel>
            <Select
                labelId="role-select-label"
                id="role-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                label="User Type"  // This is needed for the outlined variant to create the notch
            >
                <MenuItem value="Student">Student</MenuItem>
                <MenuItem value="Institution">Institution</MenuItem>
            </Select>
        </FormControl>
        </Box>
        <Box sx={{ mt: 2 }}>  {/* Adding marginTop here for spacing */}
          <form onSubmit={handleSubmit}>
            {role === 'Student' && (
              <StudentForm formData={formData} handleDataChange={handleDataChange} inputFlags={inputFlags} />
            )}
            {role === 'Institution' && (
              <InstitutionForm formData={formData} handleDataChange={handleDataChange} inputFlags={inputFlags} />
            )}
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Sign Up
            </Button>
          </form>
        </Box>
        <Grid container justifyContent="center" marginTop={3}>
          <Grid item>
            <Link href="/login" variant="body2">
              Already have an account? Sign in
            </Link>
          </Grid>
        </Grid>
      </Box>
      <Stack spacing={2} sx={{ width: '100%' }}>
        <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)}>
          <Alert onClose={() => setOpen(false)} severity={notificationStatus ? "success" : "error"}>
            {notificationStatus ? "Account Creation Successful!" : "Account Creation Failed!"}
          </Alert>
        </Snackbar>
      </Stack>
      <Copyright sx={{ mt: 5 }} />
    </Container>
  </ThemeProvider>
);
}
