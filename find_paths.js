import starforged from '@datasworn/starforged/json/starforged.json' with { type: 'json' };

function traverse(node, path = 'starforged') {
  if (node && typeof node === 'object') {
    if (node.name === 'Descriptor' || node.name === 'Role' || node.name === 'Background' || node.name === 'Asset') {
      console.log(`Found ${node.name} at: ${path}`);
    }
    // Limit depth to avoid infinite loops if circular (unlikely in JSON)
    if (path.split('.').length > 10) return;
    
    for (const key in node) {
       traverse(node[key], `${path}.${key}`);
    }
  }
}

traverse(starforged);
