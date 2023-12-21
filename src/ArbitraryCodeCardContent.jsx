import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

function ArbitraryCodeCardContent({ 
      code, 
      showMore="Show More", 
      showLess="Show Less", 
      snippet_length=30 }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleCard = () => {
    setIsExpanded(!isExpanded);
  };

  const sanitizedCode = DOMPurify.sanitize(code);

  return (
    <div>
      {snippet_length > 0 && 
      <CardContent
        sx={{
          height: isExpanded ? 'auto' : '30px',
          overflow: 'hidden',
          p: 2, // Add padding as needed
          
        }}
        dangerouslySetInnerHTML={{
          __html: isExpanded ? sanitizedCode : sanitizedCode.slice(0, snippet_length),
        }}
      />}
      <Button onClick={toggleCard}>
        {isExpanded ? showLess : showMore}
      </Button>
    </div>
  );
}

export default ArbitraryCodeCardContent
