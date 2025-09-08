# Game Flow Designer

A professional web application for designing interactive game flows using a visual canvas with drag-and-drop blocks, real-time validation, and comprehensive analysis tools.

## 🚀 Features

### Core Functionality
- **Visual Canvas**: Interactive grid-based canvas with pan, zoom, and smooth connections
- **Block Palette**: Five game block types (Start, Choice, Enemy, Treasure, End) with drag-and-drop
- **Real-time Validation**: Comprehensive flow validation with error and warning detection
- **Block Details**: Rich property editing for each block type with 2-5 relevant properties
- **Save/Load**: JSON export/import and browser localStorage with auto-save
- **Undo/Redo**: Full history management with 20+ steps
- **Flow Analysis**: Advanced computation panel with Total Adventure Score

### Technical Features
- **React Flow Integration**: Professional canvas with custom nodes and edges
- **TypeScript**: Full type safety throughout the application
- **Responsive Design**: Professional UI with Tailwind CSS
- **Unit Tests**: Comprehensive test coverage for core utilities
- **Performance Optimized**: Efficient algorithms and real-time updates

## 🛠️ Technology Stack

### Frontend Framework
- **Next.js 15.5.2**: React framework with App Router
- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Type-safe development with comprehensive interfaces

### Canvas & Visualization
- **React Flow 11.10.4**: Professional node-based editor
  - Custom node types for each block
  - Smooth edge connections with bezier curves
  - Built-in pan, zoom, and minimap
  - Keyboard shortcuts and accessibility

### State Management
- **Zustand 4.4.7**: Lightweight state management
  - **Rationale**: Chosen over Redux for simplicity and performance
  - Minimal boilerplate with TypeScript support
  - Perfect for React Flow's state management needs
  - No complex middleware or reducers required

### Styling
- **Tailwind CSS 3.4.1**: Utility-first CSS framework
  - **Rationale**: Rapid development with consistent design system
  - Responsive design out of the box
  - Custom component classes for reusability
  - Professional color scheme and typography

### Testing
- **Jest 29.7.0**: JavaScript testing framework
- **@testing-library/react**: React component testing utilities
- **jsdom**: Browser environment simulation

## 🎮 Block Types & Properties

### Start Block
**Purpose**: Entry point for the game flow
- **Title**: Game introduction name
- **Description**: Welcome message for players
- **Starting Health**: Initial player health (1-1000)
- **Starting Gold**: Initial player currency (0-10000)
- **Difficulty**: Game difficulty level (Easy/Medium/Hard)

**Rationale**: These properties establish the foundation of the player's journey, providing clear starting conditions and setting expectations for the adventure ahead.

### Choice Block
**Purpose**: Player decision points with branching narratives
- **Question**: The decision prompt presented to players
- **Option A & B**: Available choices for the player
- **Consequence A & B**: Outcomes of each choice

**Rationale**: Choice blocks are the heart of interactive storytelling. These properties enable meaningful branching narratives where player decisions have clear consequences, creating engagement and replayability.

### Enemy Block
**Purpose**: Combat encounters with strategic depth
- **Name**: Enemy identification
- **Health**: Enemy durability (1-1000)
- **Attack**: Enemy damage output (1-100)
- **Defense**: Enemy damage reduction (0-100)
- **Gold Reward**: Currency gained from victory (0-1000)
- **Experience Points**: Progression points earned (0-500)

**Rationale**: Combat encounters need balanced mechanics. These properties create strategic depth where players must consider risk vs. reward, while providing clear progression incentives through gold and experience.

### Treasure Block
**Purpose**: Rewards and loot discovery
- **Name**: Treasure identification
- **Value**: Base treasure worth (1-10000)
- **Type**: Reward category (Gold/Item/Experience/Weapon/Armor)
- **Rarity**: Drop frequency (Common/Rare/Epic/Legendary)
- **Description**: Treasure details and lore

**Rationale**: Treasure systems drive player motivation and progression. The rarity system creates excitement and replay value, while different types provide varied rewards that enhance different aspects of gameplay.

### End Block
**Purpose**: Adventure conclusions with multiple outcomes
- **Title**: Ending identification
- **Ending Type**: Outcome category (Success/Failure/Neutral)
- **Message**: Conclusion message for players
- **Final Score**: End-game scoring system (0-10000)
- **Unlock Condition**: Optional requirement for special endings

**Rationale**: Endings provide closure and satisfaction. Multiple ending types create replayability, while scoring systems enable comparison and achievement hunting.

## ✅ Validation Rules

### Required Rules
1. **Start Block Requirement**: Flow must have exactly one Start block
2. **End Block Requirement**: Flow must have at least one End block
3. **Choice Output Requirement**: Choice blocks must have 2+ outputs
4. **Enemy Connection Rule**: Enemy blocks must connect to Treasure or End blocks

### Custom Rule: Enemy Connection Requirement
**Rule**: Enemy blocks must connect to at least one Treasure or End block.

**Rationale**: In game design, combat encounters should lead to meaningful outcomes. An enemy represents a challenge, and overcoming that challenge should either reward the player (treasure) or advance the narrative toward conclusion (end). This prevents "dead-end" enemy encounters that offer no progression or reward, which can be frustrating for players. It ensures every combat encounter serves a purpose within the game flow, balancing simplicity with depth.

### Additional Validations
- **Orphaned Nodes**: Warning for disconnected blocks
- **Circular Connections**: Warning for potential infinite loops
- **Multiple Start Blocks**: Warning for multiple entry points

## 📊 Computation Panel: Total Adventure Score

### What We Compute
Instead of simple "treasure points," we calculate a comprehensive **Total Adventure Score** that evaluates multiple aspects of game design quality.

### Score Formula
```
Total Adventure Score = 
  (Treasure Value × 1.0) +
  (Enemy Rewards × 0.8) +
  (Experience × 0.5) +
  (Path Complexity × 10) +
  (Difficulty × 20) -
  (Risk-Reward Penalty if < 0.5)
```

### Why This Choice
1. **Comprehensive Evaluation**: Considers treasure value, enemy rewards, experience, complexity, and difficulty
2. **Game Design Relevance**: Reflects real game design principles and player engagement factors
3. **Actionable Insights**: Provides grade system (A+ to F), detailed breakdown, and smart recommendations
4. **Risk-Reward Analysis**: Evaluates if rewards match challenge level for balanced gameplay

### Additional Metrics
- **Treasure Value**: Sum with rarity multipliers (Common=1x, Rare=1.5x, Epic=2x, Legendary=3x)
- **Enemy Rewards**: Gold + experience converted to equivalent value
- **Experience Points**: Cumulative XP from all enemies
- **Path Complexity**: Measures branching and narrative depth
- **Risk-Reward Ratio**: Evaluates challenge vs. reward balance
- **Estimated Play Time**: Calculated based on content density

## 🧪 Testing Strategy

### Unit Tests Coverage
- **Validation Logic**: Tests for all validation rules and edge cases
- **Persistence**: JSON export/import and localStorage operations
- **Computation**: Score calculation and metric computation
- **Data Integrity**: Property preservation and error handling

### Test Files
- `__tests__/validation.test.ts`: Flow validation rules
- `__tests__/persistence.test.ts`: Save/load functionality
- `__tests__/computation.test.ts`: Score calculation algorithms

### Test Commands
```bash
npm test              # Run all tests
npm run test:watch    # Watch mode for development
npm run test:coverage # Coverage report
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd game-logic-designer-assignment

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts
```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm test             # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

## 🎯 Usage Guide

### Creating a Flow
1. **Drag Blocks**: Drag block types from the palette to the canvas
2. **Connect Blocks**: Click and drag from connection handles to create arrows
3. **Edit Properties**: Click any block to edit its properties in the side panel
4. **Validate Flow**: Check the Validation tab for errors and warnings
5. **Analyze Flow**: View the Analysis tab for comprehensive metrics

### Keyboard Shortcuts
- **Delete/Backspace**: Remove selected blocks or connections
- **Ctrl+Z**: Undo last action
- **Ctrl+Y**: Redo last undone action
- **Mouse Wheel**: Zoom in/out
- **Drag**: Pan around the canvas

### Saving & Loading
- **Auto-save**: Automatically saves to browser localStorage every 2 seconds
- **Export JSON**: Download flow as JSON file for sharing
- **Import JSON**: Upload previously saved flow files
- **Browser Storage**: Manual save/load to browser storage

## 🏗️ Architecture Decisions

### Component Structure
```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── GameFlowDesigner.tsx    # Main orchestrator
│   ├── FlowCanvas.tsx          # React Flow wrapper
│   ├── ComputationPanel.tsx    # Analysis panel
│   ├── ValidationPanel.tsx     # Validation panel
│   ├── BlockDetailsPanel.tsx   # Property editor
│   ├── SaveLoadPanel.tsx       # Persistence panel
│   ├── UndoRedoPanel.tsx       # History panel
│   └── nodes/                  # Custom node components
├── utils/                 # Utility functions
│   ├── validation.ts     # Flow validation logic
│   ├── computation.ts    # Score calculation
│   ├── persistence.ts    # Save/load operations
│   └── history.ts        # Undo/redo management
├── types/                # TypeScript definitions
│   └── blockTypes.ts     # Block property interfaces
└── __tests__/            # Unit tests
```

### State Management Strategy
- **React Flow State**: Managed by React Flow's built-in state
- **Component State**: Local state for UI interactions
- **History Management**: Custom implementation for undo/redo
- **Persistence**: Utility functions for save/load operations

### Performance Considerations
- **Debounced Auto-save**: Prevents excessive localStorage writes
- **Efficient Algorithms**: Optimized validation and computation
- **React Flow Optimization**: Proper node/edge handling
- **Memory Management**: History limit prevents memory leaks

## 🔧 Customization

### Adding New Block Types
1. Define properties in `src/types/blockTypes.ts`
2. Create node component in `src/components/nodes/`
3. Add to node types registry in `FlowCanvas.tsx`
4. Update validation rules in `src/utils/validation.ts`
5. Add computation logic in `src/utils/computation.ts`

### Extending Validation Rules
1. Add new rule function in `src/utils/validation.ts`
2. Integrate into `validateFlow` function
3. Add corresponding unit tests
4. Update validation panel UI if needed

### Customizing Computation
1. Modify score formula in `src/utils/computation.ts`
2. Add new metrics to `FlowMetrics` interface
3. Update computation panel UI
4. Add unit tests for new calculations

## 📈 Future Enhancements

### Potential Features
- **AI Integration**: Text-to-flow generation or block explanations
- **Collaborative Editing**: Real-time multi-user editing
- **Template System**: Pre-built flow templates
- **Advanced Analytics**: More detailed flow metrics
- **Export Options**: Multiple export formats (PNG, SVG, PDF)
- **Plugin System**: Extensible architecture for custom blocks

### Technical Improvements
- **Performance**: Virtualization for large flows
- **Accessibility**: Enhanced keyboard navigation
- **Mobile Support**: Touch-optimized interface
- **Offline Support**: Progressive Web App features

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Run test suite
5. Submit pull request

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality enforcement
- **Prettier**: Consistent code formatting
- **Testing**: Unit tests for new features

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **React Flow**: Excellent node-based editor library
- **Next.js**: Powerful React framework
- **Tailwind CSS**: Utility-first CSS framework
- **Jest**: Comprehensive testing framework

---

**Built with ❤️ for game designers and developers**
