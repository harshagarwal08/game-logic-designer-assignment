# Validation Rules

This document explains the validation rules implemented in the Game Flow Designer.

## Required Rules

### 1. Start Block Requirement
- **Rule**: The flow must have exactly one Start block
- **Purpose**: Ensures every game flow has a clear beginning point
- **Error Type**: Error (blocks flow execution)
- **Implementation**: Validates that exactly one node of type 'start' exists in the flow

### 2. End Block Requirement  
- **Rule**: The flow must have at least one End block
- **Purpose**: Ensures every game flow has a clear conclusion
- **Error Type**: Error (blocks flow execution)
- **Implementation**: Validates that at least one node of type 'end' exists in the flow

### 3. Choice Block Outputs
- **Rule**: Choice blocks must have 2 or more outputs
- **Purpose**: Ensures player choices lead to meaningful branching
- **Error Type**: Error (blocks flow execution)
- **Implementation**: Counts outgoing edges from each choice block and validates minimum count

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
- **Implementation**: For each enemy block, validates that at least one outgoing edge connects to a treasure or end block

## Additional Validations (Warnings)

### 5. Orphaned Nodes
- **Rule**: Blocks should be connected to the main flow
- **Purpose**: Identifies disconnected elements that won't be reachable
- **Warning Type**: Warning (doesn't block execution but indicates potential issues)
- **Implementation**: Uses graph traversal to identify nodes not reachable from start blocks

### 6. Circular Connections
- **Rule**: No infinite loops in the flow
- **Purpose**: Prevents infinite gameplay loops that could break the game
- **Warning Type**: Warning (doesn't block execution but indicates potential issues)
- **Implementation**: Detects cycles in the directed graph using depth-first search

### 7. Multiple Start Blocks
- **Rule**: Ideally only one Start block per flow
- **Purpose**: Prevents confusion about where the game begins
- **Warning Type**: Warning (doesn't block execution but indicates potential issues)
- **Implementation**: Counts start blocks and warns if more than one exists

## AI Generation Compliance

### Automatic Validation Compliance
The AI Assistant automatically generates flows that comply with all validation rules:

#### Choice Block Handling
- **Multiple Outputs**: AI automatically creates two outputs for each choice block
- **Branch Creation**: One output goes to the next block in sequence, another goes to an end block
- **Clean Connections**: No unnecessary labels or clutter in generated connections

#### Enemy Block Handling
- **Treasure Connection**: AI automatically inserts treasure blocks after enemy blocks when needed
- **End Connection**: If the next block is already treasure or end, direct connection is maintained
- **Reward Flow**: Ensures every enemy encounter leads to meaningful progression

#### Example AI Behavior
```
Input: "Start → Choice → Enemy → End"

Generated Flow:
Start → Choice ┬→ Enemy → Treasure → End
               └→ End (direct)
```

This ensures:
- ✅ Choice block has 2+ outputs
- ✅ Enemy block connects to Treasure block
- ✅ All validation rules are satisfied
- ✅ Clean, professional flow structure

## Implementation Details

### Real-time Validation
The validation system runs in real-time as users modify their flow:
- **Immediate Feedback**: Validation updates as soon as changes are made
- **Performance Optimized**: Efficient algorithms prevent UI lag
- **Comprehensive Coverage**: All rules are checked simultaneously

### Validation Panel Features
The validation panel provides:
- **Overall Status**: Clear indication of flow validity
- **Detailed Messages**: Specific error and warning descriptions
- **Node Identification**: Node IDs for easy location of issues
- **Color Coding**: Visual severity indicators (red for errors, yellow for warnings)
- **Rule Reference**: Complete list of validation rules for reference

### Error Handling
- **Error Prevention**: Errors block flow execution and must be resolved
- **Warning Guidance**: Warnings provide suggestions without blocking functionality
- **User-Friendly Messages**: Clear, actionable error descriptions
- **Context Information**: Node IDs and connection details for easy debugging

### Integration with AI
- **Automatic Compliance**: AI-generated flows automatically pass validation
- **Smart Generation**: AI considers validation rules during flow creation
- **Error Prevention**: AI prevents common validation issues before they occur
- **Clean Output**: Generated flows are structurally sound and professional

This comprehensive validation system ensures that all game flows are structurally sound, follow game design best practices, and provide meaningful player experiences.

