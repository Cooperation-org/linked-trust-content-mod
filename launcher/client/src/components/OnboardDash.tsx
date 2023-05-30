import React from 'react'
import Box from "@mui/material/Box";
import OnboardNav from './OnboardNav';
import { Stack } from '@mui/material';



const OnboardDash = () => {
    return (
        <div>
            <Box sx={{ height: "100vh", background: "white" }}>
                <OnboardNav />
               <div style={{marginTop: '5rem'}}>
               <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                        padding:'1rem',
                        display: "flex",
                        justifyContent:'space-around',
                        alignItems: "center",
                        marginBottom: "4rem",
                    }}
                >
                      <Box
                        sx={{
                            height: 400,
                            width: 300,
                            backgroundColor: 'rgba(65, 105, 225, 0.1)',
                            border: '1px solid #4169E1',
                            borderRadius: '10px'
                        }}
                    >
                        chioma
                    </Box>
                    <Box
                        sx={{
                            height: 400,
                            width: 300,
                            backgroundColor: 'rgba(50, 205, 50, 0.1);',
                            border: '1px solid #32CD32',
                            borderRadius: '10px',
                        }}
                    >
                        faith
                    </Box>
                    <Box
                        sx={{
                            height: 400,
                            width: 300,
                            backgroundColor: 'rgba(255, 0, 0, 0.1)',
                            border: '1px solid rgba(255, 0, 0, 0.8)',
                            borderRadius: '10px'
                        }}
                    >
                        blessing
                    </Box>
                    
                  
                </Stack>
               </div>
            </Box>
        </div>
    )
}

export default OnboardDash