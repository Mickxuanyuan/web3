type nodeType = {
    value: number;
    left: nodeType;
    right: nodeType;
}

function dfs(node: nodeType): number[] {
    let result: number[] = [];
    function loop(node: nodeType) {
        result.push(node.value);
        node.left && loop(node.left);
        node.right && loop(node.right);
    }

    loop(node);
   
    return result;
}

function bfs(node: nodeType): number[] {
    let result: number[] = [];

    const stack: nodeType[] = [node];
    while(stack.length > 0) {
        const current = stack.shift()!;
        result.push(current.value);

        if(current.left) stack.push(current.left);
        if(current.right) stack.push(current.right);
    }
    return result;
   
}