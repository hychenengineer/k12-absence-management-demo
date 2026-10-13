using Microsoft.AspNetCore.Mvc;
using SubConnect.Api.Models;
using SubConnect.Api.Services;

namespace SubConnect.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AiController : ControllerBase
{
    private readonly AiDispatchService _aiService;
    private readonly ILogger<AiController> _logger;

    public AiController(AiDispatchService aiService, ILogger<AiController> logger)
    {
        _aiService = aiService;
        _logger = logger;
    }

    /// <summary>
    /// Evaluates eligible substitutes for an open absence using LLM analysis (Groq, OpenAI)
    /// or the built-in intelligent multi-factor heuristic engine.
    /// </summary>
    [HttpPost("recommend-substitutes")]
    public async Task<ActionResult<AiRecommendationResponse>> RecommendSubstitutes([FromBody] AiRecommendationRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.AbsenceId))
        {
            return BadRequest("AbsenceId is required.");
        }

        try
        {
            var response = await _aiService.GetRecommendationsAsync(request);
            return Ok(response);
        }
        catch (KeyNotFoundException knf)
        {
            return NotFound(new { message = knf.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing AI dispatch recommendations for absence {AbsenceId}", request.AbsenceId);
            return StatusCode(500, new { message = "Failed to generate AI recommendations", error = ex.Message });
        }
    }
}
