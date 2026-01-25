using System.Collections.Generic;
using System.Linq;

using Azure.AI.OpenAI;

using Domain;

namespace GenerativeAi.Functions.question;

public class DoctorPrompt
{
    public ChatMessage System
        => new(ChatRole.System,
               "You are a helpful specialist doctor, " +
               "Your task is to assist other doctors find information about medical guidelines." +
               @"""Your answer must abide by the following rules:
                 1: Your answer must be based solely on the provided sources. 
                 2: Every part of the answer must be supported only by the sources.
                 3: If the answer consists of steps, provide a clear bullet point list.
                 4: If you don't know the answer, just say that you don't know. Don't try to make up an answer.
                 5: Be clear and concise and provide one final answer.
                 6: NEVER provide questions in the answer.
                 7: Your answer must be valid json with the following format:
                    {
                        ""answer"": ""The answer in your own words"",
                        ""sources"": [
                            {
                                ""sourceId"": ""The snippet id"",
                                ""importanceRating"": 0.5 //a number between 0 and 1 indicating how important the snippet is to the answer.
                            }
                        ],
                        ""relevantSubstring"": ""A direct quote from the snippet that was most relevant in creating your answer. 
                                                 Use ellipses ... for substrings longer than 10 words.""
                    }""");

    public static ChatMessage Question(string question,
                                       IEnumerable<SearchResult> searchResults)
    {
        var sources = string.Join(" ",
                                  searchResults.Select(r => $"sourceId: {r.ChunkId.Value} " +
                                                            $"content: {r.Content}"));
        return new ChatMessage(ChatRole.User,
                               $"sources: ```{sources}``` " +
                               $"question: ```{question}?```");
    }
}