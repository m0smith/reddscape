import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

function ArbitraryCodeCardContent({ code, snippet_length=30 }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleCard = () => {
    setIsExpanded(!isExpanded);
  };

  const sanitizedCode = DOMPurify.sanitize(code);

  return (
    <div>
      <CardContent
        sx={{
          height: isExpanded ? 'auto' : '30px',
          overflow: 'hidden',
          p: 2, // Add padding as needed
          
        }}
        dangerouslySetInnerHTML={{
          __html: isExpanded ? sanitizedCode : sanitizedCode.slice(0, 30),
        }}
      />
      <Button onClick={toggleCard}>
        {isExpanded ? 'Show Less' : 'Show More'}
      </Button>
    </div>
  );
}

export default ArbitraryCodeCardContent
