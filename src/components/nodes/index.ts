import StartNode from './StartNode'
import ChoiceNode from './ChoiceNode'
import EnemyNode from './EnemyNode'
import TreasureNode from './TreasureNode'
import EndNode from './EndNode'

export const nodeTypes = {
  start: StartNode,
  choice: ChoiceNode,
  enemy: EnemyNode,
  treasure: TreasureNode,
  end: EndNode,
}

export { StartNode, ChoiceNode, EnemyNode, TreasureNode, EndNode }
