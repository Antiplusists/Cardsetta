namespace Core.Models
{
    public enum CardType
    {
        Text,
        Photo,
        Mixed = Text | Photo
    }
}