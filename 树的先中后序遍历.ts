type TreeNode = {
    value: number;
    left?: TreeNode | null;
    right?: TreeNode | null;
};

// 先序遍历 根左右
function preOrder(node?: TreeNode | null) {
    if (!node) return [];
    const result: number[] = [];
    const stack: TreeNode[] = [node];

    while (stack.length) {
        const current = stack.pop()!;
        result.push(current.value);
        if (current.right) stack.push(current.right);
        if (current.left) stack.push(current.left);
    }

    return result;
}

// 中序遍历 左根右
function middleOrder(node?: TreeNode | null) {
    const result: number[] = [];
    const stack: TreeNode[] = [];
    let current: TreeNode | null | undefined = node;

    while (stack.length || current) {
        while (current) {
            stack.push(current);
            current = current.left;
        }
        current = stack.pop()!;
        result.push(current.value);
        current = current.right;
    }

    return result;
}

// 后序遍历 左右根
function postOrder(node?: TreeNode | null) {
    if (!node) return [];
    const result: number[] = [];
    const stack: TreeNode[] = [node];

    while (stack.length) {
        const current = stack.pop()!;
        result.push(current.value);
        if (current.left) stack.push(current.left);
        if (current.right) stack.push(current.right);
    }

    return result.reverse();
}

// 简单测试用例
const tree: TreeNode = {
    value: 1,
    left: {
        value: 2,
        left: { value: 4 },
        right: { value: 5 },
    },
    right: {
        value: 3,
        right: { value: 6 },
    },
};

console.log("preOrder  =>", preOrder(tree));     // [1, 2, 4, 5, 3, 6]
console.log("middleOrder =>", middleOrder(tree)); // [4, 2, 5, 1, 3, 6]
console.log("postOrder =>", postOrder(tree));    // [4, 5, 2, 6, 3, 1]



