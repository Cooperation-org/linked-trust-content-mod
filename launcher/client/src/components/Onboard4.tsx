import FormControl, { useFormControl } from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";

const Onboard4 = () => {
  return (
    <div>
        <div>
        <FormControl sx={{ width: "100%" }} style={{ marginTop: '2rem' }}>
                <label htmlFor="">Webhook endpoint for finished jobs </label>
                <OutlinedInput
                  placeholder="Please enter text"
                  sx={{
                    borderColor: "grey",
                    borderWidth: "1px",
                    borderStyle: "solid",
                  }}
                />
              </FormControl>
        </div>
             <div style={{marginBottom:'1rem'}}>
             <FormControl sx={{ width: "100%" }} style={{ marginTop: '2rem' }}>
                <label htmlFor="">Get API Key </label>
                <OutlinedInput
                  placeholder="Please enter text"
                  sx={{
                    borderColor: "grey",
                    borderWidth: "1px",
                    borderStyle: "solid",
                  }}
                />
              </FormControl>
             </div>
    </div>
  )
}

export default Onboard4