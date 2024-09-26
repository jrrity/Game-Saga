import random
jackpot=random.randint(1,100)
guess=int(input("Guess the number: "))
count=1
while(guess!=jackpot):
    if(guess<jackpot):
        print("Guess Higher")
    else:
        print("Guess lower")
    guess=int(input("Guess the number: "))
    count+=1
print("Correct guess")
print("You took ",count," attempts")
