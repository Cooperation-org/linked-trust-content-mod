import React from 'react'
import {  AppBar, Toolbar,Typography } from "@mui/material";
import repute from '../assets/reputesocial.png'

const OnboardNav = () => {
  return (
    <div>
         <AppBar position="fixed" style={{background:'white', color:'#007aff',width:'100%'}}>
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1,display:'flex', color:'brown', alignItems:'center',gap:2, fontWeight:'bold'}} >
                <img src={repute} alt="" />
                Repute.Social
              </Typography>
              <ul>
                <Typography variant='h6' sx={{fontWeight:'bold', color:'#EE814D'}}>
                  <a href="#">Login/Register</a>
                </Typography>
              </ul>
            </Toolbar>
          </AppBar>
    </div>
  )
}

export default OnboardNav