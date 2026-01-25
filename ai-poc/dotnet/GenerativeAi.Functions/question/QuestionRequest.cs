namespace GenerativeAi.Functions.question;

public record QuestionRequest(string Question,
                              string Language,
                              string Role);