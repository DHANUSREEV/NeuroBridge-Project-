export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Domain {
  id: string;
  name: string;
  description: string;
  icon: string;
  questions: Question[];
}

export interface NeuroType {
  id: string;
  name: string;
  description: string;
  domains: Domain[];
}

export const questionBank: Record<string, NeuroType> = {
  cognitive: {
    id: "cognitive",
    name: "Cognitive & Learning Differences",
    description: "Explore your analytical and problem-solving strengths",
    domains: [
      {
        id: "python",
        name: "Python Programming",
        description: "Test your Python knowledge and logical thinking",
        icon: "🐍",
        questions: [
          {
            id: "py1",
            question: "What is the output of: print(2**3)?",
            options: ["6", "8", "23", "Error"],
            correctAnswer: 1,
            explanation: "** is the exponentiation operator, so 2**3 = 2³ = 8"
          },
          {
            id: "py2",
            question: "Which keyword is used to create a class in Python?",
            options: ["class", "Class", "define", "create"],
            correctAnswer: 0,
            explanation: "The 'class' keyword is used to define a new class in Python"
          },
          {
            id: "py3",
            question: "list1 = [1,2,3]; list1.append(4); print(list1) → Output?",
            options: ["[1,2,3]", "[1,2,3,4]", "[4,1,2,3]", "Error"],
            correctAnswer: 1,
            explanation: "append() adds the element to the end of the list"
          },
          {
            id: "py4",
            question: "What will print(bool('')) return?",
            options: ["True", "False", "None", "Error"],
            correctAnswer: 1,
            explanation: "Empty string is falsy in Python, so bool('') returns False"
          },
          {
            id: "py5",
            question: "What's the difference between 'is' and '=='?",
            options: ["No difference", "'is' checks identity, '==' checks value", "'==' checks identity, 'is' checks value", "Both are syntax errors"],
            correctAnswer: 1,
            explanation: "'is' checks if two variables reference the same object, '==' checks if values are equal"
          },
          {
            id: "py6",
            question: "Which module is used for regular expressions?",
            options: ["regex", "re", "regexp", "pattern"],
            correctAnswer: 1,
            explanation: "The 're' module provides regular expression operations in Python"
          },
          {
            id: "py7",
            question: "What does len('ASD') return?",
            options: ["2", "3", "4", "Error"],
            correctAnswer: 1,
            explanation: "len() returns the length of the string, 'ASD' has 3 characters"
          },
          {
            id: "py8",
            question: "Which function converts a string to an integer?",
            options: ["str()", "int()", "float()", "convert()"],
            correctAnswer: 1,
            explanation: "int() function converts a string to an integer"
          },
          {
            id: "py9",
            question: "Identify the error: for i in range(5) print(i)",
            options: ["Missing colon after range(5)", "range should be Range", "print should be Print", "No error"],
            correctAnswer: 0,
            explanation: "Python requires a colon (:) after the for statement"
          },
          {
            id: "py10",
            question: "Which keyword defines an anonymous function?",
            options: ["def", "lambda", "function", "anonymous"],
            correctAnswer: 1,
            explanation: "lambda creates anonymous functions in Python"
          }
        ]
      },
      {
        id: "algorithms",
        name: "Algorithms & Logic",
        description: "Problem-solving and algorithmic thinking",
        icon: "🧠",
        questions: [
          {
            id: "alg1",
            question: "What is the time complexity of binary search?",
            options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
            correctAnswer: 1,
            explanation: "Binary search divides the search space in half each time, resulting in O(log n)"
          },
          {
            id: "alg2",
            question: "Which sorting algorithm has the best average case?",
            options: ["Bubble Sort", "Quick Sort", "Selection Sort", "Insertion Sort"],
            correctAnswer: 1,
            explanation: "Quick Sort has O(n log n) average case, which is optimal for comparison-based sorts"
          },
          {
            id: "alg3",
            question: "What data structure uses LIFO principle?",
            options: ["Queue", "Stack", "Array", "Tree"],
            correctAnswer: 1,
            explanation: "Stack follows Last In, First Out (LIFO) principle"
          },
          {
            id: "alg4",
            question: "In a graph, what is a node with no incoming edges called?",
            options: ["Leaf", "Root", "Source", "Sink"],
            correctAnswer: 2,
            explanation: "A source node has no incoming edges, only outgoing ones"
          },
          {
            id: "alg5",
            question: "What is the space complexity of merge sort?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correctAnswer: 2,
            explanation: "Merge sort requires additional space for the temporary arrays, making it O(n)"
          },
          {
            id: "alg6",
            question: "Which algorithm finds shortest path in weighted graphs?",
            options: ["BFS", "DFS", "Dijkstra", "Binary Search"],
            correctAnswer: 2,
            explanation: "Dijkstra's algorithm finds shortest paths from source to all vertices in weighted graphs"
          },
          {
            id: "alg7",
            question: "What is the worst case for quick sort?",
            options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"],
            correctAnswer: 1,
            explanation: "Quick sort's worst case is O(n²) when pivot is always the smallest or largest element"
          },
          {
            id: "alg8",
            question: "Hash tables provide what average case lookup time?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correctAnswer: 0,
            explanation: "Hash tables provide O(1) average case lookup through direct addressing"
          },
          {
            id: "alg9",
            question: "What traversal method visits root before children?",
            options: ["In-order", "Pre-order", "Post-order", "Level-order"],
            correctAnswer: 1,
            explanation: "Pre-order traversal visits root first, then left subtree, then right subtree"
          },
          {
            id: "alg10",
            question: "Dynamic programming is used to solve problems with what property?",
            options: ["Greedy choice", "Overlapping subproblems", "Random access", "Parallel processing"],
            correctAnswer: 1,
            explanation: "Dynamic programming optimally solves problems with overlapping subproblems"
          }
        ]
      },
      {
        id: "java",
        name: "Java Programming",
        description: "Object-oriented programming concepts",
        icon: "☕",
        questions: [
          {
            id: "java1",
            question: "Which keyword is used to inherit a class in Java?",
            options: ["implements", "extends", "inherits", "super"],
            correctAnswer: 1,
            explanation: "'extends' keyword is used for class inheritance in Java"
          },
          {
            id: "java2",
            question: "What is the size of int in Java?",
            options: ["16 bits", "32 bits", "64 bits", "Platform dependent"],
            correctAnswer: 1,
            explanation: "int in Java is always 32 bits, regardless of platform"
          },
          {
            id: "java3",
            question: "Which access modifier provides the most restrictive access?",
            options: ["public", "protected", "default", "private"],
            correctAnswer: 3,
            explanation: "private access modifier restricts access to within the same class only"
          },
          {
            id: "java4",
            question: "What does JVM stand for?",
            options: ["Java Virtual Machine", "Java Variable Method", "Java Version Manager", "Java Vendor Model"],
            correctAnswer: 0,
            explanation: "JVM stands for Java Virtual Machine, which executes Java bytecode"
          },
          {
            id: "java5",
            question: "Which method is called when an object is created?",
            options: ["main()", "constructor", "init()", "create()"],
            correctAnswer: 1,
            explanation: "Constructor is automatically called when an object is instantiated"
          },
          {
            id: "java6",
            question: "What is method overloading?",
            options: ["Same method name, different parameters", "Different method name, same parameters", "Inheriting methods", "Abstract methods"],
            correctAnswer: 0,
            explanation: "Method overloading allows multiple methods with same name but different parameters"
          },
          {
            id: "java7",
            question: "Which keyword prevents method overriding?",
            options: ["static", "final", "abstract", "synchronized"],
            correctAnswer: 1,
            explanation: "'final' keyword prevents a method from being overridden in subclasses"
          },
          {
            id: "java8",
            question: "What is the superclass of all classes in Java?",
            options: ["Class", "Super", "Object", "Base"],
            correctAnswer: 2,
            explanation: "Object class is the root of all classes in Java"
          },
          {
            id: "java9",
            question: "Which exception is thrown for array index out of bounds?",
            options: ["ArrayException", "IndexOutOfBoundsException", "ArrayIndexOutOfBoundsException", "BoundsException"],
            correctAnswer: 2,
            explanation: "ArrayIndexOutOfBoundsException is thrown when accessing invalid array index"
          },
          {
            id: "java10",
            question: "What does 'static' keyword mean?",
            options: ["Cannot be changed", "Belongs to class, not instance", "Private access", "Final value"],
            correctAnswer: 1,
            explanation: "static members belong to the class itself, not to any specific instance"
          }
        ]
      }
    ]
  },
  sensory: {
    id: "sensory",
    name: "Sensory & Processing Differences",
    description: "Explore your attention to detail and environmental awareness",
    domains: [
      {
        id: "webdev",
        name: "Web Development",
        description: "HTML, CSS, and visual design principles",
        icon: "🌐",
        questions: [
          {
            id: "web1",
            question: "What does HTML stand for?",
            options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyper Transfer Markup Language"],
            correctAnswer: 0,
            explanation: "HTML stands for HyperText Markup Language"
          },
          {
            id: "web2",
            question: "Which CSS property controls text color?",
            options: ["text-color", "font-color", "color", "text-style"],
            correctAnswer: 2,
            explanation: "The 'color' property sets the color of text"
          },
          {
            id: "web3",
            question: "What is the correct HTML tag for the largest heading?",
            options: ["<h6>", "<heading>", "<h1>", "<header>"],
            correctAnswer: 2,
            explanation: "<h1> creates the largest heading, with <h6> being the smallest"
          },
          {
            id: "web4",
            question: "Which CSS property is used to change background color?",
            options: ["bg-color", "background-color", "bgcolor", "back-color"],
            correctAnswer: 1,
            explanation: "background-color property sets the background color of an element"
          },
          {
            id: "web5",
            question: "What does CSS stand for?",
            options: ["Computer Style Sheets", "Creative Style Sheets", "Cascading Style Sheets", "Colorful Style Sheets"],
            correctAnswer: 2,
            explanation: "CSS stands for Cascading Style Sheets"
          },
          {
            id: "web6",
            question: "Which HTML tag creates a hyperlink?",
            options: ["<link>", "<a>", "<href>", "<url>"],
            correctAnswer: 1,
            explanation: "The <a> tag with href attribute creates hyperlinks"
          },
          {
            id: "web7",
            question: "How do you center align text in CSS?",
            options: ["align: center", "text-align: center", "center-align: true", "text-center: yes"],
            correctAnswer: 1,
            explanation: "text-align: center centers text horizontally"
          },
          {
            id: "web8",
            question: "Which tag is used for line breaks in HTML?",
            options: ["<break>", "<lb>", "<br>", "<newline>"],
            correctAnswer: 2,
            explanation: "<br> tag creates a line break"
          },
          {
            id: "web9",
            question: "What is the CSS box model?",
            options: ["A 3D modeling tool", "Content, padding, border, margin", "A type of HTML container", "A JavaScript framework"],
            correctAnswer: 1,
            explanation: "CSS box model consists of content, padding, border, and margin"
          },
          {
            id: "web10",
            question: "Which CSS property controls element spacing?",
            options: ["spacing", "margin", "gap", "distance"],
            correctAnswer: 1,
            explanation: "margin property controls the space around elements"
          }
        ]
      },
      {
        id: "databases",
        name: "Database Management",
        description: "Structured data organization and queries",
        icon: "🗄️",
        questions: [
          {
            id: "db1",
            question: "What does SQL stand for?",
            options: ["Structured Question Language", "Structured Query Language", "Standard Query Language", "System Query Language"],
            correctAnswer: 1,
            explanation: "SQL stands for Structured Query Language"
          },
          {
            id: "db2",
            question: "Which command is used to retrieve data from a database?",
            options: ["GET", "SELECT", "RETRIEVE", "FETCH"],
            correctAnswer: 1,
            explanation: "SELECT statement is used to query and retrieve data from database"
          },
          {
            id: "db3",
            question: "What is a primary key?",
            options: ["The first column in a table", "A unique identifier for each row", "The most important data", "A password for the database"],
            correctAnswer: 1,
            explanation: "Primary key uniquely identifies each row in a table"
          },
          {
            id: "db4",
            question: "Which SQL clause filters records?",
            options: ["FILTER", "WHERE", "HAVING", "IF"],
            correctAnswer: 1,
            explanation: "WHERE clause is used to filter records based on conditions"
          },
          {
            id: "db5",
            question: "What does INNER JOIN return?",
            options: ["All records from both tables", "Records that have matching values in both tables", "Records from the left table only", "Records from the right table only"],
            correctAnswer: 1,
            explanation: "INNER JOIN returns records that have matching values in both tables"
          },
          {
            id: "db6",
            question: "Which command adds new records to a table?",
            options: ["ADD", "INSERT", "CREATE", "APPEND"],
            correctAnswer: 1,
            explanation: "INSERT statement adds new records to a table"
          },
          {
            id: "db7",
            question: "What is normalization in databases?",
            options: ["Making all data the same", "Organizing data to reduce redundancy", "Sorting data alphabetically", "Backing up the database"],
            correctAnswer: 1,
            explanation: "Normalization organizes data to minimize redundancy and dependency"
          },
          {
            id: "db8",
            question: "Which aggregate function returns the number of rows?",
            options: ["SUM", "AVG", "COUNT", "MAX"],
            correctAnswer: 2,
            explanation: "COUNT function returns the number of rows that match the criteria"
          },
          {
            id: "db9",
            question: "What is a foreign key?",
            options: ["A key from another country", "A link between two tables", "An encrypted key", "A backup key"],
            correctAnswer: 1,
            explanation: "Foreign key creates a link between two tables, referencing primary key of another table"
          },
          {
            id: "db10",
            question: "Which command removes records from a table?",
            options: ["REMOVE", "DELETE", "DROP", "CLEAR"],
            correctAnswer: 1,
            explanation: "DELETE statement removes records from a table based on conditions"
          }
        ]
      }
    ]
  },
  motor: {
    id: "motor",
    name: "Motor & Coordination Differences",
    description: "Explore your practical problem-solving and adaptive strategies",
    domains: [
      {
        id: "cybersecurity",
        name: "Cybersecurity Basics",
        description: "Security awareness and digital safety",
        icon: "🔒",
        questions: [
          {
            id: "cyber1",
            question: "What is phishing?",
            options: ["A type of fishing", "Fraudulent attempt to obtain sensitive information", "A programming language", "A hardware component"],
            correctAnswer: 1,
            explanation: "Phishing is a social engineering attack to steal sensitive information"
          },
          {
            id: "cyber2",
            question: "What does a firewall do?",
            options: ["Prevents fires in computers", "Monitors and controls network traffic", "Speeds up internet", "Backs up data"],
            correctAnswer: 1,
            explanation: "Firewall monitors and controls incoming and outgoing network traffic"
          },
          {
            id: "cyber3",
            question: "What is malware?",
            options: ["Bad weather", "Malicious software", "Hardware failure", "Network error"],
            correctAnswer: 1,
            explanation: "Malware is software designed to harm or exploit computer systems"
          },
          {
            id: "cyber4",
            question: "What makes a strong password?",
            options: ["Short and simple", "Long, complex, and unique", "Your birthday", "Common words"],
            correctAnswer: 1,
            explanation: "Strong passwords are long, complex, and unique to each account"
          },
          {
            id: "cyber5",
            question: "What is two-factor authentication?",
            options: ["Two passwords", "Additional security layer beyond password", "Two computers", "Two internet connections"],
            correctAnswer: 1,
            explanation: "2FA adds an extra layer of security beyond just a password"
          },
          {
            id: "cyber6",
            question: "What is encryption?",
            options: ["Making text larger", "Converting data into coded format", "Deleting data", "Copying data"],
            correctAnswer: 1,
            explanation: "Encryption converts data into a coded format to protect it from unauthorized access"
          },
          {
            id: "cyber7",
            question: "What is a VPN?",
            options: ["Very Private Network", "Virtual Private Network", "Variable Public Network", "Verified Personal Network"],
            correctAnswer: 1,
            explanation: "VPN (Virtual Private Network) creates secure connection over public networks"
          },
          {
            id: "cyber8",
            question: "What should you do if you receive a suspicious email?",
            options: ["Click all links", "Forward to everyone", "Delete and report", "Reply immediately"],
            correctAnswer: 2,
            explanation: "Suspicious emails should be deleted and reported to prevent security risks"
          },
          {
            id: "cyber9",
            question: "What is social engineering?",
            options: ["Building bridges", "Manipulating people to reveal information", "Engineering software", "Social media management"],
            correctAnswer: 1,
            explanation: "Social engineering manipulates people into divulging confidential information"
          },
          {
            id: "cyber10",
            question: "Why are software updates important?",
            options: ["They make software slower", "They fix security vulnerabilities", "They use more memory", "They change the interface"],
            correctAnswer: 1,
            explanation: "Software updates often include security patches that fix vulnerabilities"
          }
        ]
      },
      {
        id: "networking",
        name: "Computer Networks",
        description: "Understanding how computers communicate",
        icon: "🌐",
        questions: [
          {
            id: "net1",
            question: "What does IP stand for?",
            options: ["Internet Protocol", "Internal Process", "Information Package", "Integrated Program"],
            correctAnswer: 0,
            explanation: "IP stands for Internet Protocol, which governs how data is sent over networks"
          },
          {
            id: "net2",
            question: "What is the purpose of DNS?",
            options: ["Translate domain names to IP addresses", "Provide internet security", "Store website data", "Connect cables"],
            correctAnswer: 0,
            explanation: "DNS (Domain Name System) translates human-readable domain names to IP addresses"
          },
          {
            id: "net3",
            question: "What does WWW stand for?",
            options: ["World Wide Web", "World War Web", "Web Wide World", "Wide World Web"],
            correctAnswer: 0,
            explanation: "WWW stands for World Wide Web"
          },
          {
            id: "net4",
            question: "What is bandwidth?",
            options: ["Width of a cable", "Amount of data transmitted over time", "Distance between networks", "Number of computers"],
            correctAnswer: 1,
            explanation: "Bandwidth refers to the maximum amount of data that can be transmitted over a network"
          },
          {
            id: "net5",
            question: "What does HTTP stand for?",
            options: ["HyperText Transfer Protocol", "High Tech Transfer Process", "Home Text Transfer Program", "HyperText Transport Package"],
            correctAnswer: 0,
            explanation: "HTTP stands for HyperText Transfer Protocol"
          },
          {
            id: "net6",
            question: "What is a router?",
            options: ["A type of cable", "Device that forwards data between networks", "Software program", "Internet provider"],
            correctAnswer: 1,
            explanation: "Router is a networking device that forwards data packets between computer networks"
          },
          {
            id: "net7",
            question: "What does LAN stand for?",
            options: ["Large Area Network", "Local Area Network", "Long Access Network", "Limited Area Network"],
            correctAnswer: 1,
            explanation: "LAN stands for Local Area Network, covering a small geographic area"
          },
          {
            id: "net8",
            question: "What is the difference between HTTP and HTTPS?",
            options: ["No difference", "HTTPS is secure, HTTP is not", "HTTP is faster", "HTTPS is older"],
            correctAnswer: 1,
            explanation: "HTTPS is the secure version of HTTP, using encryption to protect data"
          },
          {
            id: "net9",
            question: "What is ping used for?",
            options: ["Playing games", "Testing network connectivity", "Sending emails", "Browsing websites"],
            correctAnswer: 1,
            explanation: "Ping tests the reachability of a host on a network and measures round-trip time"
          },
          {
            id: "net10",
            question: "What does URL stand for?",
            options: ["Universal Resource Locator", "Uniform Resource Locator", "United Resource Link", "Universal Reference Link"],
            correctAnswer: 1,
            explanation: "URL stands for Uniform Resource Locator, the address of a web resource"
          }
        ]
      }
    ]
  }
};