import { Typography } from '@mui/material'
import React from 'react'
import FormControl, { useFormControl } from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";

const Onboard3 = () => {
  return (
    <div>
        <p style={{color:'black'}}>
        Check our <a href="#" style={{textDecoration:'none', color:'blue'}}>standard rules</a> curated with industry high standards  
        </p>


        <FormControl sx={{ width: "25ch" }} style={{ marginTop: '2rem' }}>
                <label htmlFor="">Custom rules requested </label>
                <OutlinedInput
                  placeholder="Please enter text"
                  sx={{
                    borderColor: "#007aff",
                    borderWidth: "1px",
                    borderStyle: "solid",
                  }}
                />
              </FormControl>
    </div>
  )
}

export default Onboard3