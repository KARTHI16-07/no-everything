package com.noeverything.config;

import com.noeverything.entity.*;
import com.noeverything.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final DailyQuoteRepository quoteRepository;
    private final ChallengeRepository challengeRepository;
    private final AchievementRepository achievementRepository;
    private final QuestionRepository questionRepository;
    private final HabitRepository habitRepository;
    private final HabitLogRepository habitLogRepository;
    private final TaskRepository taskRepository;
    private final FocusSessionRepository focusSessionRepository;
    private final JournalEntryRepository journalRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           UserProfileRepository userProfileRepository,
                           DailyQuoteRepository quoteRepository,
                           ChallengeRepository challengeRepository,
                           AchievementRepository achievementRepository,
                           QuestionRepository questionRepository,
                           HabitRepository habitRepository,
                           HabitLogRepository habitLogRepository,
                           TaskRepository taskRepository,
                           FocusSessionRepository focusSessionRepository,
                           JournalEntryRepository journalRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
        this.quoteRepository = quoteRepository;
        this.challengeRepository = challengeRepository;
        this.achievementRepository = achievementRepository;
        this.questionRepository = questionRepository;
        this.habitRepository = habitRepository;
        this.habitLogRepository = habitLogRepository;
        this.taskRepository = taskRepository;
        this.focusSessionRepository = focusSessionRepository;
        this.journalRepository = journalRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        initQuotes();
        initChallenges();
        initAchievements();
        initQuestions();
        initDefaultUser();
    }

    private void initQuotes() {
        if (quoteRepository.count() > 0) return;

        List<DailyQuote> quotes = List.of(
                new DailyQuote(
                        "We exist to create and champion the exceptional.",
                        "NO EVERYTHING MANIFESTO",
                        "VISION",
                        "Excellence is not an accidental event; it is an invariant discipline of deliberate subtraction.",
                        "Foundational Architecture"
                ),
                new DailyQuote(
                        "Simplicity is the ultimate sophistication. Eliminate what is unnecessary so the necessary may speak.",
                        "LEONARDO DA VINCI",
                        "MASTERY",
                        "True mastery emerges when there are no more components left to remove.",
                        "Codex Atlanticus"
                ),
                new DailyQuote(
                        "You do not rise to the level of your goals. You fall to the level of your systems.",
                        "JAMES CLEAR",
                        "DISCIPLINE",
                        "Habits are the compound interest of self-improvement.",
                        "Atomic Systems"
                ),
                new DailyQuote(
                        "First make it work, then make it right, then make it fast.",
                        "KENT BECK",
                        "CODING",
                        "Incremental clarity prevents architectural paralysis.",
                        "Extreme Programming"
                ),
                new DailyQuote(
                        "The impediment to action advances action. What stands in the way becomes the way.",
                        "MARCUS AURELIUS",
                        "RESILIENCE",
                        "Friction is not a barrier; it is the raw fuel of transformation.",
                        "Meditations"
                ),
                new DailyQuote(
                        "Deep work is the ability to focus without distraction on a cognitively demanding task.",
                        "CAL NEWPORT",
                        "FOCUS",
                        "Shallow work satisfies ego; deep work establishes legacy.",
                        "Rules for Focused Success"
                )
        );

        quoteRepository.saveAll(quotes);
    }

    private void initChallenges() {
        if (challengeRepository.count() > 0) return;

        List<Challenge> challenges = List.of(
                new Challenge("DAILY_POMO_4", "Iron Focus Protocol", "Complete 4 deep work focus blocks (100 mins total) today.", "FOCUS", 4, "blocks", "DAILY", 150, "Timer"),
                new Challenge("DAILY_HABIT_3", "Trio of Discipline", "Check off at least 3 daily habits before twilight.", "HABIT", 3, "habits", "DAILY", 100, "CheckSquare"),
                new Challenge("WEEKLY_NQT_3", "NQT Crucible Sprint", "Take 3 timed mock simulation tests this week with >75% accuracy.", "NQT", 3, "tests", "WEEKLY", 350, "FileText"),
                new Challenge("WEEKLY_FOCUS_10", "Centurion Century", "Accumulate 500 total minutes of deep focus sessions in 7 days.", "FOCUS", 500, "minutes", "WEEKLY", 400, "Clock"),
                new Challenge("SPECIAL_ZERO_DISTRACTION", "Radical Subtraction", "Maintain a flawless 7-day streak on your primary discipline habit.", "DISCIPLINE", 7, "days", "SPECIAL", 600, "Zap")
        );

        challengeRepository.saveAll(challenges);
    }

    private void initAchievements() {
        if (achievementRepository.count() > 0) return;

        List<Achievement> achievements = List.of(
                new Achievement("ACH_FIRST_STEP", "The First Spark", "Complete your very first task on the platform.", "MASTERY", "Sparkles", "TASKS_COMPLETED", 1, "COMMON"),
                new Achievement("ACH_FOCUS_100", "Century of Depth", "Accumulate your first 100 minutes of deep focus time.", "FOCUS", "Clock", "FOCUS_MINUTES", 100, "COMMON"),
                new Achievement("ACH_FOCUS_500", "Deep State Operator", "Log 500 minutes in the Focus Laboratory.", "FOCUS", "Flame", "FOCUS_MINUTES", 500, "RARE"),
                new Achievement("ACH_STREAK_7", "Seven-Day Invariant", "Achieve an uninterrupted 7-day habit streak.", "DISCIPLINE", "Shield", "HABIT_STREAK", 7, "RARE"),
                new Achievement("ACH_TASKS_20", "Execution Engine", "Conquer 20 distinct actionable tasks.", "DISCIPLINE", "CheckCircle2", "TASKS_COMPLETED", 20, "RARE"),
                new Achievement("ACH_NQT_TEST_5", "Crucible Veteran", "Complete 5 competitive examination mock simulations.", "NQT", "Award", "NQT_TESTS", 5, "EPIC"),
                new Achievement("ACH_JOURNAL_10", "The Examined Life", "Document 10 private reflections in the Deep Journal.", "MASTERY", "BookOpen", "JOURNAL_ENTRIES", 10, "EPIC")
        );

        achievementRepository.saveAll(achievements);
    }

    private void initQuestions() {
        if (questionRepository.count() > 0) return;

        // 1. Core Java Question 1
        Question q1 = new Question(
                "JAVA", "Collections", "INTERMEDIATE",
                "What is the output of the following Java snippet regarding HashMap hash collisions?",
                "Map<String, Integer> map = new HashMap<>();\nmap.put(new String(\"Aa\"), 1);\nmap.put(new String(\"BB\"), 2);\nSystem.out.println(map.size());",
                "In Java, 'Aa' and 'BB' have the exact same hashCode (2112), but String.equals() evaluates to false. Thus, both distinct keys are stored in the same bucket, resulting in a size of 2.",
                true, "TCS NQT", 2024
        );
        q1.addOption("A", "1 (second key overwrites the first)", false);
        q1.addOption("B", "2 (both entries stored in the same bucket)", true);
        q1.addOption("C", "Throws HashCollisionException", false);
        q1.addOption("D", "Compilation error", false);
        questionRepository.save(q1);

        // 2. Core Java Question 2
        Question q2 = new Question(
                "JAVA", "OOP / Multithreading", "ADVANCED",
                "Why is the volatile keyword necessary in double-checked locking singleton pattern?",
                "public class Singleton {\n    private static volatile Singleton instance;\n    public static Singleton getInstance() {\n        if (instance == null) {\n            synchronized(Singleton.class) {\n                if (instance == null) instance = new Singleton();\n            }\n        }\n        return instance;\n    }\n}",
                "Without volatile, CPU instruction reordering can allow a thread to see a non-null instance before the Singleton constructor has finished executing, leading to partially constructed object reads.",
                true, "TCS NQT", 2023
        );
        q2.addOption("A", "To prevent deadlocks during synchronized block entry", false);
        q2.addOption("B", "To prevent instruction reordering that exposes partially constructed instances", true);
        q2.addOption("C", "To allow garbage collection of the singleton instance", false);
        q2.addOption("D", "To enforce serialization of the class", false);
        questionRepository.save(q2);

        // 3. Python Question 1
        Question q3 = new Question(
                "PYTHON", "Data Structures", "INTERMEDIATE",
                "What will be the output of the following Python dictionary comprehension?",
                "nums = [1, 2, 3, 4]\nd = {x: x**2 for x in nums if x % 2 == 0}\nprint(d)",
                "The list comprehension filters for even numbers (2 and 4), mapping 2 -> 4 and 4 -> 16.",
                true, "Infosys DSE", 2024
        );
        q3.addOption("A", "{1: 1, 3: 9}", false);
        q3.addOption("B", "{2: 4, 4: 16}", true);
        q3.addOption("C", "[4, 16]", false);
        q3.addOption("D", "{4, 16}", false);
        questionRepository.save(q3);

        // 4. SQL Question 1
        Question q4 = new Question(
                "SQL", "Aggregations & Joins", "INTERMEDIATE",
                "Which SQL query correctly finds the 2nd highest salary from an Employee table without using LIMIT or TOP?",
                "SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);",
                "Subquery finds the overall maximum salary; the outer query finds the maximum salary strictly smaller than that, yielding the second highest salary portably across ANSI SQL.",
                true, "TCS NQT", 2024
        );
        q4.addOption("A", "SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee)", true);
        q4.addOption("B", "SELECT salary FROM Employee ORDER BY salary DESC OFFSET 2", false);
        q4.addOption("C", "SELECT SECOND(MAX(salary)) FROM Employee", false);
        q4.addOption("D", "SELECT salary FROM Employee WHERE ROWNUM = 2", false);
        questionRepository.save(q4);

        // 5. Quantitative Aptitude
        Question q5 = new Question(
                "APTITUDE", "Speed, Time & Distance", "FOUNDATION",
                "A train 180 meters long running at 54 km/hr will pass an electric pole in how many seconds?",
                null,
                "Speed in m/s = 54 * (5/18) = 15 m/s. Time to pass a point object = Distance / Speed = 180 / 15 = 12 seconds.",
                true, "TCS NQT", 2023
        );
        q5.addOption("A", "10 seconds", false);
        q5.addOption("B", "12 seconds", true);
        q5.addOption("C", "15 seconds", false);
        q5.addOption("D", "18 seconds", false);
        questionRepository.save(q5);

        // 6. Logical Reasoning
        Question q6 = new Question(
                "LOGICAL", "Syllogism", "INTERMEDIATE",
                "Statements:\n1. All architects are visionaries.\n2. Some visionaries are builders.\nConclusions:\nI. Some architects are builders.\nII. Some builders are visionaries.",
                null,
                "Since 'Some visionaries are builders', by conversion 'Some builders are visionaries' is definitely true. Conclusion I does not necessarily follow.",
                true, "Wipro Elite", 2024
        );
        q6.addOption("A", "Only conclusion I follows", false);
        q6.addOption("B", "Only conclusion II follows", true);
        q6.addOption("C", "Either I or II follows", false);
        q6.addOption("D", "Neither I nor II follows", false);
        questionRepository.save(q6);

        // 7. Technical Subjects (OS / DBMS)
        Question q7 = new Question(
                "TECHNICAL", "Operating Systems", "ADVANCED",
                "Which condition is NOT one of Coffman's four conditions required for a deadlock to occur?",
                null,
                "The four Coffman conditions are: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. Preemption breaks deadlocks; 'Preemption Allowed' is NOT a condition for deadlock.",
                true, "TCS NQT", 2024
        );
        q7.addOption("A", "Mutual Exclusion", false);
        q7.addOption("B", "Hold and Wait", false);
        q7.addOption("C", "Preemption Allowed", true);
        q7.addOption("D", "Circular Wait", false);
        questionRepository.save(q7);
    }

    private void initDefaultUser() {
        if (userRepository.existsByUsername("architect")) return;

        User user = new User("architect", "architect@noeverything.com", passwordEncoder.encode("Pass123!"));
        user.setRole("ROLE_USER");
        user.setEnabled(true);
        User savedUser = userRepository.save(user);

        UserProfile profile = new UserProfile(savedUser);
        profile.setFullName("Kaelen Vance");
        profile.setBio("Architect of systems. Dedicated to relentless self-mastery, high-leverage execution, and radical minimalism.");
        profile.setFocusGoalDailyMinutes(120);
        profile.setHabitGoalDailyCount(4);
        profile.setTaskGoalDailyCount(3);
        profile.setThemePreference("dark");
        userProfileRepository.save(profile);

        // Initialize realistic initial records for the default user
        LocalDate today = LocalDate.now();

        // Habit 1: Deep Code Sprint
        Habit h1 = new Habit(savedUser, "Deep Code Sprint", "Write clean, modular code with zero browser tab distractions.", "CODING", 7);
        h1.setStreakCount(5);
        h1.setBestStreak(12);
        habitRepository.save(h1);
        habitLogRepository.save(new HabitLog(h1, today, true));
        habitLogRepository.save(new HabitLog(h1, today.minusDays(1), true));
        habitLogRepository.save(new HabitLog(h1, today.minusDays(2), true));
        habitLogRepository.save(new HabitLog(h1, today.minusDays(3), true));
        habitLogRepository.save(new HabitLog(h1, today.minusDays(4), true));

        // Habit 2: Daily NQT Revision
        Habit h2 = new Habit(savedUser, "Daily NQT Revision", "Solve 5 technical questions and review algorithmic complexities.", "LEARNING", 6);
        h2.setStreakCount(3);
        h2.setBestStreak(7);
        habitRepository.save(h2);
        habitLogRepository.save(new HabitLog(h2, today, true));
        habitLogRepository.save(new HabitLog(h2, today.minusDays(1), true));
        habitLogRepository.save(new HabitLog(h2, today.minusDays(2), true));

        // Habit 3: Stoic Evening Reflection
        Habit h3 = new Habit(savedUser, "Stoic Evening Reflection", "Record daily friction, lessons learned, and tomorrow's critical path.", "DISCIPLINE", 7);
        h3.setStreakCount(4);
        h3.setBestStreak(14);
        habitRepository.save(h3);
        habitLogRepository.save(new HabitLog(h3, today.minusDays(1), true));
        habitLogRepository.save(new HabitLog(h3, today.minusDays(2), true));
        habitLogRepository.save(new HabitLog(h3, today.minusDays(3), true));
        habitLogRepository.save(new HabitLog(h3, today.minusDays(4), true));

        // Tasks
        Task t1 = new Task(savedUser, "Architect Distributed Ingestion Pipeline", "Implement idempotent Kafka consumers with dead-letter queue routing.", "HIGH", "CODE", today, 90);
        t1.setCompleted(true);
        t1.setCompletedAt(LocalDateTime.now().minusHours(2));
        taskRepository.save(t1);

        Task t2 = new Task(savedUser, "Master SQL Window Functions (Lead/Lag)", "Practice running totals, partitions, and moving averages on LeetCode database.", "HIGH", "STUDY", today, 45);
        taskRepository.save(t2);

        Task t3 = new Task(savedUser, "Review Spring Security Filter Chain", "Verify JWT extractors, CORS origins, and stateless session lifecycle.", "MEDIUM", "WORK", today.plusDays(1), 60);
        taskRepository.save(t3);

        // Focus Session
        FocusSession fs1 = new FocusSession(savedUser, 50, "POMODORO", "CODE", "High-efficiency Spring Boot API implementation.");
        fs1.setCompletedAt(LocalDateTime.now().minusHours(3));
        focusSessionRepository.save(fs1);

        FocusSession fs2 = new FocusSession(savedUser, 25, "POMODORO", "STUDY", "NQT Collections and Multithreading review.");
        fs2.setCompletedAt(LocalDateTime.now().minusHours(1));
        focusSessionRepository.save(fs2);

        // Journal
        JournalEntry j1 = new JournalEntry(
                savedUser,
                "On the Elimination of Non-Essential Vectors",
                "Real progress did not accelerate when I added more priorities. It accelerated the exact day I severed four non-essential projects and poured undivided intensity into the master architecture. Friction is simply energy demanding alignment.",
                "FOCUSED",
                "architecture, clarity, discipline",
                today
        );
        j1.setFavorite(true);
        journalRepository.save(j1);
    }
}
