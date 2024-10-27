export const codeSnippets = [
    `# Step 1: Initialize the results array inside the main function\n
  def generate_subsets(nums):\n    results = []\n`,
    `# Step 2: Define the backtracking function (helper) without implementation\n
  def generate_subsets(nums):\n    results = []\n\n    def helper(current, start):\n        pass\n    helper([], 0)\n\n    return results`,
    `# Step 3: Define the helper with parameters (current, start) for backtracking\n
  def generate_subsets(nums):\n    results = []\n\n    def helper(current, start):\n        pass\n    helper([], 0)\n\n    return results`,
    `# Step 4: Implement the backtracking logic (add current to results)\n
  def generate_subsets(nums):\n    results = []\n\n    def helper(current, start):\n        results.append(current[:])\n        for i in range(start, len(nums)):\n            current.append(nums[i])\n            helper(current, i + 1)\n            current.pop()\n    helper([], 0)\n\n    return results`,
    `# Step 5: Final implementation with helper logic\n
  def generate_subsets(nums):\n    results = []\n\n    def helper(current, start):\n        results.append(current[:])\n        for i in range(start, len(nums)):\n            current.append(nums[i])\n            helper(current, i + 1)\n            current.pop()\n    helper([], 0)\n\n    return results\n\nnums = [1, 2, 3]\nprint(generate_subsets(nums))`,
  ];
  
  export const instructions = [
    "Step 1: Initialize the results array inside the main function, which will hold the final subsets.",
    "Step 2: Define the helper function `helper(current, start)` inside `generate_subsets()` but with no logic yet.",
    "Step 3: Define the `helper()` function with parameters `current` (current subset) and `start` (starting index).",
    "Step 4: Implement the backtracking logic: add the current subset to `results` and explore further using recursion.",
    "Step 5: Complete the `generate_subsets` function, returning the final result of all subsets.",
  ];
  
  export const treeDataFull = {
    name: '[]',
    children: [
      { name: '[1]', children: [{ name: '[1, 2]', children: [{ name: '[1, 2, 3]' }] }] },
      { name: '[2]', children: [{ name: '[2, 3]' }] },
      { name: '[3]' },
    ],
  };
  
  export const treeDataSteps = [
    { name: 'results = []', children: [] },
    { name: 'helper()', children: [{ name: 'results = []' }] },
    { name: 'helper(current, start)', children: [{ name: 'current: []', children: [{ name: 'start: 0' }] }] },
    { name: 'Backtracking logic', children: [{ name: 'append current subset', children: [{ name: 'recurse to next element' }] }] },
    {
      name: 'Backtracking tree',
      children: [
        {
          name: '[]',
          children: [
            { name: '[1]', children: [{ name: '[1, 2]', children: [{ name: '[1, 2, 3]' }] }] },
            { name: '[2]', children: [{ name: '[2, 3]' }] },
            { name: '[3]' },
          ],
        },
      ],
    },
  ];
  