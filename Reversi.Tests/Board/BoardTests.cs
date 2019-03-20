using System;
using NUnit.Framework;

namespace ReversiTests.Board
{
    [TestFixture]
    public class BoardTests
    {
        [TestFixture]
        public class SizeTests
        {
            [TestCase(1, 1)]
            [TestCase(12, 12)]
            [TestCase(4, 6)]
            [TestCase(6, 4)]
            public void Test_ShouldReturnCorrectSize_WhenInitialised(int width, int height)
            {
                //    Arrange, act
                Reversi.Board.Board board = new Reversi.Board.Board(width, height);

                //    Assert
                Assert.That(board.Size.Width, Is.EqualTo(width));
                Assert.That(board.Size.Height, Is.EqualTo(height));
            }

            [TestCase(-12, 12)]
            [TestCase(12, -12)]
            [TestCase(-4, -6)]
            [TestCase(-6, -4)]
            public void Test_ShouldThrowException_WhenGivenNegativeSize(int width, int height)
            {
                //    Assert
                Assert.That(() => new Reversi.Board.Board(width, height), Throws.TypeOf(typeof(IndexOutOfRangeException)));
            }
        }

        [TestFixture]
        public class MyClass
        {
        }
    }
}