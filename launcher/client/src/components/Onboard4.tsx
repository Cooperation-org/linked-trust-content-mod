import FormControl, { useFormControl } from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";

const Onboard4 = () => {
  return (
    <div style={{color:'black'}}>
        <div>
        <FormControl sx={{ width: "100%" }} style={{ marginTop: '2rem' }}>
                <label htmlFor="">Webhook endpoint for finished jobs <span style={{color:'red'}}>*</span></label>
                <OutlinedInput
                  placeholder="Please enter text"
                  sx={{
                    borderColor: "grey",
                    borderWidth: "1px",
                    borderStyle: "solid",
                  }}
                />
              </FormControl>
              <p style={{color:'#EE814D',fontSize:'14px'}}>Instructions for using Web-hook</p>
        </div>
             <div style={{marginBottom:'1rem'}}>
             <FormControl sx={{ width: "100%" }} style={{ marginTop: '2rem' }}>
                <label htmlFor="">Get API Key <span style={{color:'red'}}>*</span></label>
                <OutlinedInput
                  placeholder="Please enter text"
                  sx={{
                    borderColor: "grey",
                    borderWidth: "1px",
                    borderStyle: "solid",
                  }}
                />
                <p style={{color:'#EE814D',fontSize:'14px'}}>Instructions for using API</p>
              </FormControl>
             </div>
    </div>
  )
}

export default Onboard4