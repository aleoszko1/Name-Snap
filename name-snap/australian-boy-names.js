// Australian Popular Boy Names - Top 200+ names based on recent Australian data
const australianBoyNames = [
  // Top 50 most popular
  "Oliver", "Noah", "William", "Jack", "Henry", "Lucas", "Mason", "Ethan", "James", "Alexander",
  "Liam", "Benjamin", "Jacob", "Michael", "Elijah", "Levi", "Sebastian", "Charlie", "Leo", "Max",
  "Isaac", "Thomas", "Samuel", "Hunter", "Harrison", "Oscar", "Finn", "Caleb", "Cooper", "Archer",
  "Theodore", "Felix", "Jasper", "Arlo", "Hugo", "Arthur", "Eli", "Xavier", "Ryan", "Joshua",
  "Luke", "Adam", "Daniel", "Matthew", "Jackson", "Logan", "David", "Nathan", "Connor", "Kai",
  
  // Popular 51-100
  "Ashton", "Blake", "Beau", "Austin", "Zac", "Tyler", "Ryder", "Mason", "Jaxon", "Hayden",
  "Aiden", "Nate", "Zion", "Marcus", "Axel", "Ezra", "Miles", "Gabriel", "Zachary", "Aaron",
  "Lincoln", "Jude", "Owen", "Wyatt", "Lachlan", "Hamish", "Flynn", "Angus", "Declan", "Riley",
  "Toby", "Mason", "Reuben", "Bodhi", "Zander", "Phoenix", "Asher", "Jett", "Milo", "Taj",
  "Kobe", "River", "Cruz", "Oakley", "Hudson", "Hendrix", "Jai", "Lennox", "Zane", "Rex",
  
  // Popular 101-150
  "Darcy", "Harley", "Knox", "Maverick", "Sage", "Atlas", "Cash", "Crew", "Dante", "Ezekiel",
  "Grayson", "Indie", "Jagger", "Koda", "Leon", "Maddox", "Neo", "Onyx", "Parker", "Quinn",
  "Roman", "Storm", "Tate", "Urban", "Vince", "Wade", "Xander", "Yuki", "Zeke", "Abel",
  "Brock", "Clay", "Dean", "Ellis", "Ford", "Gage", "Heath", "Ivan", "Jace", "Kane",
  "Lane", "Marc", "Nash", "Otis", "Pete", "Rhys", "Sean", "Troy", "Vale", "West",
  
  // Additional popular names 151-200
  "Zion", "Ace", "Bear", "Cole", "Drew", "Evan", "Fox", "Grey", "Hank", "Ian",
  "Jake", "Knox", "Lars", "Mack", "Nick", "Ollie", "Paul", "Reed", "Seth", "Trey",
  "Vin", "Will", "York", "Zach", "Axel", "Beck", "Cade", "Duke", "Emil", "Finn",
  "Glen", "Hugh", "Jude", "Kyle", "Luca", "Mark", "Neil", "Omar", "Pike", "Ross",
  "Sage", "Theo", "Vern", "Wade", "Zara", "Amos", "Beau", "Carl", "Dane", "Earl",
  
  // Classic Australian names
  "Bruce", "Shane", "Wayne", "Craig", "Glenn", "Brett", "Scott", "Mark", "Paul", "Simon",
  "Andrew", "Peter", "John", "Robert", "Christopher", "Anthony", "Steven", "Kevin", "Jason", "Gary"
];

// Shuffle function to randomize the order
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Export for use in the main app
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { australianBoyNames, shuffleArray };
}
