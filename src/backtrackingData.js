export const codeSnippets = [
    `# Step 1: Initialize the results array inside the main function\n
def generate_subsets(nums):\n    results = []\n`,
    `# Step 2: Define the backtracking function (helper) without implementation\n
def generate_subsets(nums):\n    results = []\n\n    def helper(current, start):\n        pass\n    helper([], 0)\n\n    return results`,
    `# Step 3: Define the helper with parameters (current, start) for backtracking\n
def generate_subsets(nums):\n    results = []\n\n    def helper(current, start):\n        pass\n    helper([], 0)\n\n    return results`,
    `# Step 4: Explain the arguments passed to the helper function\n
def generate_subsets(nums):\n    results = []\n\n    def helper(current, start):\n        """\n        current: This will store the current subset being built\n        start: The index from which we continue generating subsets\n        """\n        pass\n    helper([], 0)\n\n    return results`,
    `# Step 5: Implement the backtracking logic (add current to results)\n
def generate_subsets(nums):\n    results = []\n\n    def helper(current, start):\n        results.append(current[:])\n        for i in range(start, len(nums)):\n            current.append(nums[i])\n            helper(current, i + 1)\n            current.pop()\n    helper([], 0)\n\n    return results`,
    `# Step 6: Final implementation with helper logic\n
def generate_subsets(nums):\n    results = []\n\n    def helper(current, start):\n        results.append(current[:])\n        for i in range(start, len(nums)):\n            current.append(nums[i])\n            helper(current, i + 1)\n            current.pop()\n    helper([], 0)\n\n    return results\n\nnums = [1, 2, 3]\nprint(generate_subsets(nums))`,
  ];
  
  export const instructions = [
    "Step 1: Initialize the results array inside the main function, which will hold the final subsets.",
    "Step 2: Define the helper function `helper(current, start)` inside `generate_subsets()` but with no logic yet.",
    "Step 3: Define the `helper()` function with parameters `current` (current subset) and `start` (starting index).",
    "Step 4: Explain the arguments passed to the `helper(current, start)` function:\n- `current`: The current subset being constructed\n- `start`: The starting index for further exploration.",
    "Step 5: Implement the backtracking logic: add the current subset to `results` and explore further using recursion.",
    "Step 6: Complete the `generate_subsets` function, returning the final result of all subsets.",
  ];
  
  
  // Full tree showing all subsets (results at leaves)
export const treeDataFull = {
    name: '[]',
    children: [
      {
        name: '[1]',
        children: [
          {
            name: '[1, 2]',
            children: [{ name: '[1, 2, 3]' }],
          },
          {
            name: '[1, 3]',  // Adding [1,3] subset
          },
        ],
      },
      {
        name: '[2]',
        children: [{ name: '[2, 3]' }],
      },
      { name: '[3]' },
    ],
  };
  
  
// Tree data for each step
export const treeDataSteps = [
    {
      name: 'results = []',
      children: [],
    },
    {
      name: 'helper()',
      children: [
        { name: 'results = []' },
      ],
    },
    {
      name: 'helper(current, start)',
      children: [
        { name: 'current: []', children: [{ name: 'start: 0' }] },
      ],
    },
    {
      name: 'Backtracking logic',
      children: [
        {
          name: 'append current subset',
          children: [{ name: 'recurse to next element' }],
        },
      ],
    },
    {
      name: 'Backtracking tree',
      children: [
        {
          name: '[]',
          children: [
            { name: '[1]', children: [
                { name: '[1, 2]', children: [{ name: '[1, 2, 3]' }] },
                { name: '[1, 3]' },  // Adding [1,3] here as well
              ],
            },
            { name: '[2]', children: [{ name: '[2, 3]' }] },
            { name: '[3]' },
          ],
        },
      ],
    },
  ];
  
  