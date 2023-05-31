import {useState} from 'react'
import Box from "@mui/material/Box";
import OnboardNav from './OnboardNav';
import Onboard1 from './Onboard1';
import CustomStepper from './OnboardSteps';
import HorizontalNonLinearStepper from './OnboardStepper';

const OnboardingMod = () => {
const [showcontent, setshowcontent] = useState<boolean>(false)
function contentview(newvalue:boolean){
  setshowcontent(newvalue)
}
      return (
        <Box sx={{ height: "100vh", background: "white" }}>
         <OnboardNav />
           {showcontent?<CustomStepper  />: <Onboard1 view={contentview} />}
           
           {/* <HorizontalNonLinearStepper /> */}
        </Box>
      );
    };
    
export default OnboardingMod