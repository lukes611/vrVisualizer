import math

class Volout:
    def __init__(self, minIn, maxIn, res):
        self.min = minIn
        self.max = maxIn
        self.len = [self.max[i]-self.min[i] for i in range(3)]
        self.ld = max(self.len[0], self.len[1], self.len[2])
        self.ar = [[0,0,0,0] for i in range(res*res*res)]
        self.res = res
        self.ressq = res * res

    def push(self, x,y,z, r,g,b):
        x -= self.min[0]
        y -= self.min[1]
        z -= self.min[2]

        x *= self.res / self.len[0]
        y *= self.res / self.len[1]
        z *= self.res / self.len[2]

        x = int(math.floor(x))
        y = int(math.floor(y))
        z = int(math.floor(z))

        if x < 0 or x >= self.res or y < 0 or y >= self.res or z < 0 or z >= self.res:
            return

        index = z * self.ressq + y * self.res + x;

        c = self.ar[index][3]
        scalar = c / float(c+1)
        scalar2 = 1 / float(c+1)
        self.ar[index][0] = r * scalar + self.ar[index][0] * scalar2
        self.ar[index][1] = g * scalar + self.ar[index][1] * scalar2
        self.ar[index][2] = b * scalar + self.ar[index][2] * scalar2

        self.ar[index][3] += 1

    def write(self,fileName):
        out = open(fileName, 'w')
        has = False
        for z in range(self.res):
            for y in range(self.res):
                for x in range(self.res):
                    index = z * self.ressq + y * self.res + x
                    a = self.ar[index]
                    if a[3] > 0:
                        if has: out.write(';')
                        tmp = [x,y,z] + [int(b) for b in a[0:3]] #[x,y,z].concat(a.slice(0,3)).map(Math.floor.bind(Math));
                        out.write(','.join([str(i) for i in tmp]))
                        has = True
        out.close()
        
def readStats(fileName):
    min = None
    max = None
    file = open(fileName, 'r')
    for line in file:
        if line[0] != '#':
            nums = [float(i) for i in line.split(',')]
            if min != None:
                for j in range(3):
                    min[j] = min[j] if min[j] < nums[j] else nums[j]
                    max[j] = max[j] if max[j] > nums[j] else nums[j]
            else:
                min = nums[0:3]
                max = nums[0:3]
    file.close()
    return min, max

fn = 'multi_selection.csv'
mn, mx = readStats(fn)
vo = Volout(mn, mx, 256)
file = open(fn, 'r')
for line in file:
    if line[0] != '#':
        nums = [float(i) for i in line.split(',')]
        vo.push(nums[0], nums[1], nums[2], nums[3], nums[4], nums[5])
        #print nums
file.close()
vo.write('pc.txt')
    
    
