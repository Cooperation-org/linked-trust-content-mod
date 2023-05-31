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
                gridTemplateColumns: "repeat(2, 1fr)",
                alignItems: "center",
                justifyContent:'space-between',
                // :'center',
                marginBottom: "4rem",
                gap:4
              }}
            >
              <FormControl sx={{ width: "100%" }}>
                <label htmlFor=""style={{fontSize:'14px'}}>Group Name <span style={{color:'red'}}>*</span></label>
                <OutlinedInput
                
                  sx={{
                    borderColor: "grey",
                    borderWidth: "1px",
                    borderStyle: "solid",
                  }}
                />
              </FormControl>
              <FormControl sx={{ width: "100%" }} style={{ marginTop: 0 }}>
                <label htmlFor="" style={{fontSize:'14px'}}>Contact Name <span style={{color:'red'}}>*</span></label>
                <OutlinedInput
                  placeholder="Please enter text"
                  sx={{
                    borderColor: "grey",
                    borderWidth: "1px",
                    borderStyle: "solid",
                  }}
                />
              </FormControl>
              <FormControl sx={{ width: "100%" }}>
                <label htmlFor="" style={{fontSize:'14px'}}> Email <span style={{color:'red'}}>*</span></label>
                <OutlinedInput
                  
                  sx={{
                    borderColor: "grey",
                    borderWidth: "1px",
                    borderStyle: "solid",
                  }}
                />
              </FormControl>
             
            </Stack>
    
      </Box>

      
    </Box>
  );
};

export default Onboard2;