import { useState,FC, ChangeEvent } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Stack, AppBar, Toolbar, Typography, Button } from "@mui/material";
import FormControl, { useFormControl } from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import { styled } from "@mui/system";
import MenuItem from "@mui/material/MenuItem";
import Switch, { SwitchProps } from "@mui/material/Switch";

interface Currency{
    value:string;
}
const Onboard2 :FC = () => {
  const [showInput, setShowInput] = useState(false);

  const handleSwitchChange = (event:ChangeEvent<HTMLInputElement>) => {
    setShowInput(event.target.checked);
  };
  const currencies:Currency[] = [
    {
      value: "Text only",
    },
    {
      value: "Text / Images",
    },
    {
      value: "Text / Images / Videos",
    },
  ];

  const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 36,
    height: 24,
    padding: 0,
    display: "flex",
    "&:active": {
      "& .MuiSwitch-thumb": {
        width: 20,
      },
      "& .MuiSwitch-switchBase.Mui-checked": {
        transform: "translateX(9px)",
      },
    },
    "& .MuiSwitch-switchBase": {
      padding: 2,
      "&.Mui-checked": {
        transform: "translateX(12px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          opacity: 1,
          backgroundColor:
            theme.palette.mode === "dark" ? "#177ddc" : "#1890ff",
        },
      },
    },
    "& .MuiSwitch-thumb": {
      boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
      width: 20,
      height: 20,
      borderRadius: 50,
    },
    "& .MuiSwitch-track": {
      borderRadius: 100 / 2,
      opacity: 1,
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(255,255,255,.35)"
          : "rgba(0,0,0,.25)",
      boxSizing: "border-box",
    },
  }));
  const StyledTextarea = styled(TextareaAutosize)(
    ({ theme }) => `
     
        font-family: IBM Plex Sans, sans-serif;
        font-size: 0.875rem;
        font-weight: 400;
        line-height: 1.5;
        padding: 12px;
        border-radius: 5px ;
        color: ${
          theme.palette.mode === "dark" ? "inherit" : "rgba(0, 0, 0, 0.87)"
        };
        background: transparent;
        border: 2px solid #007aff;
        box-shadow: none;
      
        &:hover {
          border-color: none;
        }
      
        &:focus {
          border-color: none;
          box-shadow: none;
        }
      
        // firefox
        &:focus-visible {
          outline: 0;
        }
      `
  );

  return (
    <Box sx={{  background: "white" }}>
      

      <Box
        component="form"
        noValidate
        autoComplete="off"
        sx={{ padding: "2rem" }}
      >
        <Stack
          direction="column"
          spacing={2}
          sx={{
            display: "grid",
            alignItems: "center",
            marginBottom: "4rem",
          }}
        >
          <FormControl sx={{ width: "25ch" }}>
            <label htmlFor="">
              Group Name <span style={{ color: "red" }}>*</span>
            </label>
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
            <label htmlFor="">
              Fund Amount <span style={{ color: "red" }}>*</span>
            </label>
            <OutlinedInput
              placeholder="Please enter text"
              sx={{
                borderColor: "#007aff",
                borderWidth: "1px",
                borderStyle: "solid",
              }}
            />
          </FormControl>
          <div style={{ display: "flex" }}>
            <span>
              Type of content to be moderated{" "}
              <span style={{ color: "red" }}>*</span>
            </span>
            <TextField id="standard-select-currency" select variant="standard">
              {currencies.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.value}
                </MenuItem>
              ))}
            </TextField>
          </div>

          <FormControl sx={{ width: "25ch" }}>
            <label htmlFor="">
              {" "}
              Group description <span style={{ color: "red" }}>*</span>
            </label>
            <StyledTextarea aria-label=" textarea" placeholder="Empty" />
          </FormControl>
        
          {/* toggle */}
          <div style={{ display: "flex", gap: 8 }}>
            Will you need more customization or custom integrations?{" "}
            <span style={{ color: "red" }}>*</span>
            <AntSwitch
              defaultChecked
              checked={showInput}
              inputProps={{ "aria-label": "ant design" }}
              onChange={handleSwitchChange}
            />
          </div>
          {/* toggle */}
        </Stack>
        {showInput && (
          <FormControl sx={{ width: "25ch" }}>
            <label htmlFor="">
              {" "}
              Please list extra features needed 
            </label>
            <StyledTextarea aria-label=" textarea" placeholder="Empty" />
          </FormControl>
        )}
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
       
      </Box>
    </Box>
  );
};

export default Onboard2;