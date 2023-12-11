import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';

export default function CardModal({ src, alt, onClose , isVideo }) {
if (!src) return null;
  return (
    <div style={{
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        backgroundColor: 'rgba(0, 0, 0, 0.8)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        zIndex: 1000
    }}>
    <Card sx={{ maxWidth: '100%' }}>
      <CardActionArea   onClick={onClose}>
        <CardMedia
          component={isVideo? "video": "img"}
          autoPlay={isVideo}
          controls={isVideo}
          image={src}
          alt={alt}
        />
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">
          Share
        </Button>
      </CardActions>
    </Card>
    </div>
  );
}