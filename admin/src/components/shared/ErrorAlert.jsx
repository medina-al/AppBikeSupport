import React from 'react'
import { Alert } from '@mui/material';

export default function ErrorAlert(props) {
  return (
    <div className='m-2'>
      <Alert severity="error">{props.data}</Alert>
    </div>
  );
}