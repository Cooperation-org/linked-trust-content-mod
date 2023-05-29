
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from '@mui/material/MenuItem'
import { Stack, Typography, Button } from "@mui/material";
import FormControl, { useFormControl } from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";


const Onboard1 = () => {
    const stage = [
        {
          value: "Thinking about it / Just testing",
        },
        {
          value: "Have live jobs ready to go",
        },
       
      ];

      const average = [
        {
          value: "No idea",
        },
        {
          value: "Less than 10.000",
        },
        {
          value: "More than 10.000  ",
        },
      ];
      
    
  return (
    <div>
           <Box
            component="form"
            noValidate
            autoComplete="off"
            sx={{ padding: "4rem" ,paddingBottom:'0',marginTop:'1rem'}}
          >
            <Typography
              variant="h2"
              sx={{ fontSize: "30px", margin: "2rem 0", color: "#007aff", fontWeight: "bold"}}
            >
              5 Minutes to Moderation
            </Typography>
    
            <Stack
              direction="column"
              spacing={2}
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 500px)",
                alignItems: "center",
                marginBottom: "4rem",
              }}
            >
              <FormControl sx={{ width: "25ch" }}>
                <label htmlFor="">Company Name <span style={{color:'red'}}>*</span></label>
                <OutlinedInput
                  placeholder="Please enter text"
                  sx={{
                    borderColor: "#007aff",
                    borderWidth: "1px",
                    borderStyle: "solid",
                  }}
                />
              </FormControl>
              <FormControl sx={{ width: "25ch" }} style={{ marginTop: 0 }}>
                <label htmlFor="">company Size <span style={{color:'red'}}>*</span></label>
                <OutlinedInput
                  placeholder="Please enter text"
                  sx={{
                    borderColor: "#007aff",
                    borderWidth: "1px",
                    borderStyle: "solid",
                  }}
                />
              </FormControl>
              <FormControl sx={{ width: "25ch" }}>
                <label htmlFor="">Contact Email <span style={{color:'red'}}>*</span></label>
                <OutlinedInput
                  placeholder="Please enter text"
                  sx={{
                    borderColor: "#007aff",
                    borderWidth: "1px",
                    borderStyle: "solid",
                  }}
                />
              </FormControl>
            </Stack>
            <Stack
              direction="column"
              spacing={2}
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 500px)",
                alignItems: "center",
                marginBottom: "4rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span> What stage are you at?  <span style={{color:'red'}}>*</span></span>
                <TextField
          id="standard-select-currency"
          select
          variant="standard"
          sx={{ width: "20ch" }}
        >
          {stage.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.value}
            </MenuItem>
          ))}
        </TextField>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span> What is your average monthly volume? <span style={{color:'red'}}>*</span> </span>
                <TextField
          id="standard-select-currency"
          select
          variant="standard"
      
        >
          {average.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.value}
            </MenuItem>
          ))}
        </TextField>
              </div>
            </Stack>
          </Box>
    
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              sx={{
                background: "#007aff",
                color: "white",
                padding: "0.5rem 3rem",
                "&:hover": {
                  borderColor: "#007aff",
                  borderWidth: "2px",
                  borderStyle: "solid",
                  color: "#007aff",
                },
              }}
            >
              Contact me
            </Button>
            <Button
              sx={{
                background: "#007aff",
                color: "white",
                padding: "0.5rem 3rem",
                "&:hover": {
                  borderColor: "#007aff",
                  borderWidth: "2px",
                  borderStyle: "solid",
                  color: "#007aff",
                },
              }}
            >
              Get Started
            </Button>
          </Box>
    </div>
  )
}

export default Onboard1