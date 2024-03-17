# README

This example foregoes drawing images, and just draws shapes and text. It also introduces one of several forms of loops to draw each rectangle in the dashed line down the center.

## A Note on Maintainability

Note that the numbers used in this example are deceptively simple. Try and think about how I came up with these numbers and you'll see it takes some time to figure them out - this is something we want to avoid when writing good code. Many folks think less code is better. While there is definitely truth to that, there's a balance to be had - you never want to reduce code at the cost of maintainability. That is, if people want to understand your code and/or tweak it, how much do they have to read and what should they change? If they need to spend too much time reading your code and/or change more than one thing, you've likely written something poorly. We're all human, so nothing we write will turn out perfect, but these two things are what we aim for. Write code for people first, computers second.

Many developers like to create efficient code for the computer to run as fast as it can - even in non-critical parts of the code. Despite how good this sounds, it isn't a good way to write code by default because efficient code often removes steps that are important for human understanding and it costs time to figure out how to optimize (I actually wrote example 5 first then removed steps). This is a common enough practice that we have a name for it: **Premature optimization**. This goes along with a common saying: "premature optimization is the root of all evil". Of course, we shouldn't take this to mean "don't optimize" - it's just a matter of being selective of which code and when, since it comes with costs.

There are multiple types of optimizations. For example, mutation (changing a value) is an optimization. This means, to avoid premature optimization, We should copy data by default, not change it.

## Practice Using This Example

Practice using variables by modifying this example. Change each number in the `context.fillRect()` calls to use named variables and/or expressions. Note that `canvasElement.width` and `canvasElement.height` can be used to get the total width and height of the canvas (`1920` and `1080`, respectively - we just use the variable name because the number could change later). And, remember that **you are adjusting the (x, y) coordinates for the top left corner of your boxes**. This means, for a point on the right side, you'd need to take into consideration the width of the object you are drawing. To better visualize it, I recommend drawing out a grid on a piece of paper to represent the screen, then add the paddles on it as an example. Put dots at the top left corners and try to figure out a simple formula to calculate the coordinates (the x and y values) for each paddle. It's okay if you don't remember geometry from when you were in school. You mostly just need to know that adding on the x-axis moves you right, subtracting / adding a negative number moves left. For the y-axis, adding moves down, subtracting / adding a negative number moves up.

Once done with that, simply wrap all of the drawing operations in a single `render` function, then call that function. This will be handy for the next example.
