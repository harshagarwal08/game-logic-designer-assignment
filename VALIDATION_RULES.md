# Validation Rules

This document explains the validation rules implemented in the Game Flow Designer.

## Required Rules

### 1. Start Block Requirement
- **Rule**: The flow must start with at least one Start block
- **Purpose**: Ensures every game flow has a clear beginning point
- **Error Type**: Error (blocks flow execution)

### 2. End Block Requirement  
- **Rule**: The flow must end with at least one End block
- **Purpose**: Ensures every game flow has a clear conclusion
- **Error Type**: Error (blocks flow execution)

### 3. Choice Block Outputs
- **Rule**: Choice blocks must have 2 or more outputs
- **Purpose**: Ensures player choices lead to meaningful branching
- **Error Type**: Error (blocks flow execution)

## Custom Rule

### 4. Enemy Block Connections
- **Rule**: Enemy blocks must connect to at least one Treasure or End block
- **Purpose**: Ensures that defeating enemies leads to meaningful rewards or conclusions
- **Rationale**: 
  - In game design, combat encounters should provide value to the player
  - Enemies that don't lead to rewards or story progression create dead ends
  - This rule encourages meaningful game progression and player satisfaction
  - It prevents "empty" combat encounters that waste player time
- **Error Type**: Error (blocks flow execution)

## Additional Validations (Warnings)

### 5. Orphaned Nodes
- **Rule**: Blocks should be connected to the main flow
- **Purpose**: Identifies disconnected elements that won't be reachable
- **Warning Type**: Warning (doesn't block execution but indicates potential issues)

### 6. Circular Connections
- **Rule**: No infinite loops in the flow
- **Purpose**: Prevents infinite gameplay loops that could break the game
- **Warning Type**: Warning (doesn't block execution but indicates potential issues)

### 7. Multiple Start Blocks
- **Rule**: Ideally only one Start block per flow
- **Purpose**: Prevents confusion about where the game begins
- **Warning Type**: Warning (doesn't block execution but indicates potential issues)

## Implementation Details

The validation system runs in real-time as users modify their flow. Errors prevent the flow from being considered valid, while warnings highlight potential issues without blocking execution.

The validation panel shows:
- Overall validation status
- Detailed error/warning messages
- Node IDs for easy identification
- Color-coded severity levels
- List of all validation rules for reference
