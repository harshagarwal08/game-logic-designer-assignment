const fs = require('fs');

// Read the file
let content = fs.readFileSync('src/components/BlockDetailsPanel.tsx', 'utf8');

// Remove the useEffect entirely and use a different approach
content = content.replace(
  'const [localProperties, setLocalProperties] = useState<Record<string, any>>({})
  const prevNodeIdRef = useRef<string | null>(null)

  useEffect(() => {
    const currentNodeId = selectedNode?.id || null
    if (currentNodeId !== prevNodeIdRef.current) {
      prevNodeIdRef.current = currentNodeId
      if (selectedNode) {
        setLocalProperties(selectedNode.data?.properties || {})
      } else {
        setLocalProperties({})
      }
    }
  }, [selectedNode?.id])',
  'const [localProperties, setLocalProperties] = useState<Record<string, any>>(() => selectedNode?.data?.properties || {})'
);

// Remove useRef import since we're not using it anymore
content = content.replace(
  'import React, { useState, useEffect, useRef } from \'react\'',
  'import React, { useState, useEffect } from \'react\''
);

// Add a useEffect that only runs when the node ID changes (not the entire node object)
content = content.replace(
  'const [localProperties, setLocalProperties] = useState<Record<string, any>>(() => selectedNode?.data?.properties || {})',
  `const [localProperties, setLocalProperties] = useState<Record<string, any>>(() => selectedNode?.data?.properties || {})
  const prevNodeIdRef = useRef<string | null>(selectedNode?.id || null)

  useEffect(() => {
    const currentNodeId = selectedNode?.id || null
    if (currentNodeId !== prevNodeIdRef.current) {
      prevNodeIdRef.current = currentNodeId
      if (selectedNode) {
        setLocalProperties(selectedNode.data?.properties || {})
      } else {
        setLocalProperties({})
      }
    }
  }, [selectedNode?.id])`
);

// Add useRef back to imports
content = content.replace(
  'import React, { useState, useEffect } from \'react\'',
  'import React, { useState, useEffect, useRef } from \'react\''
);

// Write the file back
fs.writeFileSync('src/components/BlockDetailsPanel.tsx', content);
console.log('Infinite loop fix applied successfully');
