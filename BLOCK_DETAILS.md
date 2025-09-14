# Block Details Documentation

This document explains the properties and details available for each block type in the Game Flow Designer.

## Block Types and Their Properties

### 1. Start Block
**Purpose**: Defines the beginning of a game flow

**Properties**:
- **Title** (string): The name/title of the starting point
- **Description** (string): Welcome message or introduction text
- **Starting Health** (number): Initial health points for the player (1-1000)
- **Starting Gold** (number): Initial gold/currency for the player (0-10000)
- **Difficulty** (enum): Game difficulty level (Easy/Medium/Hard)

**Rationale**: Start blocks need to establish the initial game state. Health and gold are fundamental RPG mechanics. Difficulty affects the overall challenge level and can influence subsequent encounters.

**Display**: Properties are displayed as read-only text fields in the Block Details Panel for easy viewing and reference.

### 2. Choice Block
**Purpose**: Represents player decision points with branching paths

**Properties**:
- **Question** (string): The decision prompt presented to the player
- **Option A** (string): First choice available to the player
- **Consequence A** (string): What happens when Option A is chosen
- **Option B** (string): Second choice available to the player
- **Consequence B** (string): What happens when Option B is chosen

**Rationale**: Choice blocks are core to interactive storytelling. Having both options and consequences allows designers to create meaningful branching narratives where player decisions have clear outcomes.

**Display**: All choice properties are shown as read-only text blocks, making it easy to review the branching logic without accidental modifications.

### 3. Enemy Block
**Purpose**: Represents combat encounters or challenges

**Properties**:
- **Name** (string): The enemy's name or type
- **Health** (number): Enemy's hit points (1-1000)
- **Attack Power** (number): Damage the enemy deals (1-100)
- **Defense** (number): Damage reduction/armor (0-100)
- **Gold Reward** (number): Currency gained upon victory (0-1000)
- **Experience Points** (number): XP gained upon victory (0-1000)

**Rationale**: Combat is a fundamental game mechanic. Health, attack, and defense create tactical depth. Rewards (gold and XP) provide progression incentives and make combat meaningful rather than just obstacles.

**Display**: Enemy stats and rewards are displayed as read-only values, allowing designers to review combat balance without risk of accidental changes.

### 4. Treasure Block
**Purpose**: Represents rewards, items, or valuable discoveries

**Properties**:
- **Name** (string): The treasure's name
- **Value** (number): Monetary or point value (1-10000)
- **Type** (enum): Category of treasure (Gold/Item/Experience/Weapon/Armor)
- **Rarity** (enum): How uncommon the treasure is (Common/Rare/Epic/Legendary)
- **Description** (string): Detailed description of the treasure

**Rationale**: Rewards drive player engagement. Different types allow for varied progression (weapons for combat, armor for defense, gold for economy). Rarity creates excitement and replay value.

**Display**: Treasure details are shown as read-only text, making it easy to review reward systems and ensure proper balance.

### 5. End Block
**Purpose**: Defines conclusion points of the game flow

**Properties**:
- **Title** (string): The ending's name
- **Ending Type** (enum): Nature of the ending (Victory/Defeat/Neutral)
- **Message** (string): Final message to the player
- **Final Score** (number): Points awarded at this ending (0-10000)
- **Unlock Condition** (string): Optional requirement for special endings

**Rationale**: Endings provide closure and satisfaction. Different ending types allow for varied outcomes based on player performance. Final scores enable comparison and replay motivation.

**Display**: Ending details are displayed as read-only text blocks, allowing designers to review conclusion logic and scoring systems.

## Design Philosophy

### Why These Properties?

1. **Game Design Fundamentals**: Each property serves a core game design purpose
2. **Player Agency**: Properties that affect player choices and consequences
3. **Progression Systems**: Health, gold, XP, and equipment create advancement
4. **Narrative Depth**: Descriptions and consequences enable storytelling
5. **Replayability**: Rarity, difficulty, and multiple endings encourage replay

### Property Relationships

- **Start → Choice**: Initial resources affect available choices
- **Choice → Enemy**: Decisions can lead to different combat encounters
- **Enemy → Treasure**: Combat rewards provide progression
- **Treasure → End**: Accumulated rewards affect final outcomes

### Validation Rules

The properties work with our validation system:
- Choice blocks must have 2+ outputs (enabled by having multiple options)
- Enemy blocks must connect to Treasure or End (rewards make combat meaningful)
- Start and End blocks ensure complete game flows

## Technical Implementation

### Read-Only Display System
- All properties are displayed as read-only text blocks in the Block Details Panel
- Properties are stored in the node's `data.properties` object
- Properties are validated and have sensible defaults
- Changes are automatically saved to localStorage
- Properties are included in JSON export/import
- Real-time validation ensures data integrity

### Benefits of Read-Only Display
1. **Prevents Accidental Changes**: No risk of accidentally modifying block properties
2. **Clean Interface**: Simplified UI without complex input validation
3. **Easy Review**: Quick overview of all block properties without editing complexity
4. **Stable Canvas**: Reduces re-rendering issues and improves performance
5. **Focus on Flow**: Emphasizes the visual flow design over individual property editing

### Property Management
- Properties are set when blocks are created or generated by AI
- Default values are applied automatically for new blocks
- AI generation creates appropriate property values based on block type
- All properties are preserved during save/load operations
- Properties are included in flow analysis and computation

This design creates a comprehensive yet intuitive system for designing game flows that balances simplicity with depth, focusing on the visual flow design while providing easy access to block details for review and analysis.

