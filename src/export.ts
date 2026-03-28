import { TrelloCard, TrelloList, TrelloAction, TrelloChecklist } from './interfaces';

/**
 * Export a Trello card to Markdown format
 */
export function exportCardToMarkdown(
  card: TrelloCard,
  list: TrelloList | null,
  comments: TrelloAction[],
  checklists: TrelloChecklist[]
): string {
  const lines: string[] = [];

  // Title
  lines.push(`# ${card.name}`);
  lines.push('');

  // Basic info
  lines.push('## 基本信息');
  lines.push('');
  if (list) {
    lines.push(`- **列表**: ${list.name}`);
  }
  lines.push(`- **链接**: [查看卡片](${card.url})`);
  if (card.due) {
    const dueDate = new Date(card.due);
    lines.push(`- **截止日期**: ${dueDate.toLocaleString('zh-CN')}`);
  }
  if (card.labels && card.labels.length > 0) {
    const labelNames = card.labels.map(l => l.name || l.color).join(', ');
    lines.push(`- **标签**: ${labelNames}`);
  }
  lines.push('');

  // Description
  if (card.desc) {
    lines.push('## 描述');
    lines.push('');
    lines.push(card.desc);
    lines.push('');
  }

  // Checklist
  if (checklists && checklists.length > 0) {
    lines.push('## Checklist');
    lines.push('');
    for (const checklist of checklists) {
      lines.push(`### ${checklist.name}`);
      lines.push('');
      for (const item of checklist.checkItems) {
        const checked = item.state === 'complete' ? 'x' : ' ';
        lines.push(`- [${checked}] ${item.name}`);
      }
      lines.push('');
    }
  }

  // Comments
  if (comments && comments.length > 0) {
    lines.push('## 评论');
    lines.push('');
    for (const comment of comments) {
      const author = comment.memberCreator.fullName;
      const date = new Date(comment.date).toLocaleString('zh-CN');
      lines.push(`### ${author} (${date})`);
      lines.push('');
      lines.push(comment.data.text);
      lines.push('');
    }
  }

  // Footer
  lines.push('---');
  lines.push(`*导出于 ${new Date().toLocaleString('zh-CN')}*`);

  return lines.join('\n');
}
