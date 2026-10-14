"""
时屿 PWA 图标生成脚本
使用 Pillow 生成多尺寸 PNG 图标
"""
from PIL import Image, ImageDraw, ImageFont
import math

def generate_icon(size, output_path):
    """生成指定尺寸的时屿图标"""
    # 创建透明背景图像
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # 缩放因子
    s = size / 512
    
    # 中心坐标
    cx = size / 2
    cy = size / 2
    
    # 1. 圆形背景渐变（用多层圆模拟渐变）
    bg_radius = int(240 * s)
    for i in range(bg_radius, 0, -1):
        t = i / bg_radius
        # 从 #4A8BAF 到 #2D5A78 的渐变
        r = int(74 + (45 - 74) * (1 - t))
        g = int(139 + (90 - 139) * (1 - t))
        b = int(175 + (120 - 175) * (1 - t))
        draw.ellipse([cx - i, cy - i, cx + i, cy + i], fill=(r, g, b, 255))
    
    # 2. 海浪装饰线
    wave_color = (255, 255, 255, 26)  # 0.1 opacity
    wave_color2 = (255, 255, 255, 20)  # 0.08 opacity
    
    # 第一条海浪
    wave_y1 = int(320 * s)
    draw_wave(draw, wave_y1, size, wave_color, int(2 * s))
    
    # 第二条海浪
    wave_y2 = int(360 * s)
    draw_wave(draw, wave_y2, size, wave_color2, int(2 * s))
    
    # 3. 岛屿主体（用贝塞尔曲线近似）
    isle_color_top = (91, 163, 201, 255)  # #5BA3C9
    isle_color_bottom = (59, 110, 143, 255)  # #3B6E8F
    
    # 岛屿形状点
    isle_top = int(220 * s)
    isle_bottom = int(290 * s)
    isle_left = int(100 * s)
    isle_right = int(412 * s)
    isle_mid_y = int(280 * s)
    
    # 绘制岛屿（用多边形近似）
    points = []
    steps = 40
    for i in range(steps + 1):
        t = i / steps
        x = isle_left + (isle_right - isle_left) * t
        
        # 上边缘：中间高两边低
        if t < 0.5:
            local_t = t * 2
            y_offset = (1 - local_t * local_t) * (isle_mid_y - isle_top) * 0.8
            y = isle_mid_y - y_offset - abs(local_t - 0.5) * 20 * s
        else:
            local_t = (t - 0.5) * 2
            y_offset = (1 - local_t * local_t) * (isle_mid_y - isle_top) * 0.8
            y = isle_mid_y - y_offset - abs(local_t - 0.5) * 20 * s
        points.append((x, y))
    
    # 下边缘
    for i in range(steps, -1, -1):
        t = i / steps
        x = isle_left + (isle_right - isle_left) * t
        y = isle_bottom + math.sin(t * math.pi * 2) * 8 * s
        points.append((x, y))
    
    # 填充岛屿（用渐变效果 - 多层）
    for layer in range(20):
        t = layer / 20
        r = int(isle_color_top[0] + (isle_color_bottom[0] - isle_color_top[0]) * t)
        g = int(isle_color_top[1] + (isle_color_bottom[1] - isle_color_top[1]) * t)
        b = int(isle_color_top[2] + (isle_color_bottom[2] - isle_color_top[2]) * t)
        
        shrink = layer * 2 * s
        layer_points = []
        for px, py in points:
            dx = px - cx
            dy = py - cy
            dist = math.sqrt(dx * dx + dy * dy)
            if dist > 0:
                ratio = (dist - shrink) / dist
                layer_points.append((cx + dx * ratio, cy + dy * ratio))
            else:
                layer_points.append((px, py))
        
        if len(layer_points) >= 3:
            draw.polygon(layer_points, fill=(r, g, b, 255))
    
    # 4. 日晷表盘（椭圆）
    sundial_cx = cx
    sundial_cy = int(220 * s)
    sundial_rx = int(48 * s)
    sundial_ry = int(16 * s)
    gold_color = (201, 162, 39, 255)  # #C9A227
    
    # 绘制日晷表盘（发光效果 - 多层）
    for glow in range(3, 0, -1):
        glow_alpha = int(80 / glow)
        draw.ellipse(
            [sundial_cx - sundial_rx - glow * s, sundial_cy - sundial_ry - glow * s,
             sundial_cx + sundial_rx + glow * s, sundial_cy + sundial_ry + glow * s],
            outline=(245, 215, 110, glow_alpha),
            width=int(glow * s)
        )
    
    # 主表盘
    draw.ellipse(
        [sundial_cx - sundial_rx, sundial_cy - sundial_ry,
         sundial_cx + sundial_rx, sundial_cy + sundial_ry],
        outline=gold_color,
        width=int(3.5 * s)
    )
    
    # 5. 日晷指针
    pointer_top_y = int(160 * s)
    pointer_bottom_y = sundial_cy
    pointer_width = int(5 * s)
    
    # 指针发光效果
    for glow in range(3, 0, -1):
        glow_alpha = int(100 / glow)
        glow_w = pointer_width + glow * 2 * s
        draw.line(
            [sundial_cx, pointer_top_y, sundial_cx, pointer_bottom_y],
            fill=(245, 215, 110, glow_alpha),
            width=int(glow_w)
        )
    
    # 主指针
    draw.line(
        [sundial_cx, pointer_top_y, sundial_cx, pointer_bottom_y],
        fill=gold_color,
        width=pointer_width
    )
    
    # 6. 指针顶部光点
    dot_radius = int(6 * s)
    for glow in range(4, 0, -1):
        glow_alpha = int(150 / glow)
        r = dot_radius + glow * 2 * s
        draw.ellipse(
            [sundial_cx - r, pointer_top_y - 2 * s - r,
             sundial_cx + r, pointer_top_y - 2 * s + r],
            fill=(245, 215, 110, glow_alpha)
        )
    
    draw.ellipse(
        [sundial_cx - dot_radius, pointer_top_y - 2 * s - dot_radius,
         sundial_cx + dot_radius, pointer_top_y - 2 * s + dot_radius],
        fill=(245, 215, 110, 255)
    )
    
    # 7. 底部小海浪
    wave_color_light = (255, 255, 255, 64)
    wave_color_mid = (255, 255, 255, 51)
    
    draw_small_wave(draw, int(130 * s), int(370 * s), int(80 * s), wave_color_light, int(2.5 * s))
    draw_small_wave(draw, int(256 * s), int(375 * s), int(68 * s), wave_color_mid, int(2 * s))
    draw_small_wave(draw, int(340 * s), int(365 * s), int(60 * s), wave_color_light, int(2.5 * s))
    
    # 保存
    img.save(output_path, 'PNG')
    print(f'Generated: {output_path} ({size}x{size})')

def draw_wave(draw, y, width, color, thickness):
    """绘制一条波浪线"""
    points = []
    amplitude = 10
    frequency = 6
    for x in range(0, width + 1, 2):
        offset = math.sin(x / width * frequency * math.pi) * amplitude
        points.append((x, y + offset))
    
    if len(points) >= 2:
        draw.line(points, fill=color, width=thickness)

def draw_small_wave(draw, center_x, center_y, width, color, thickness):
    """绘制一个小波浪"""
    points = []
    amplitude = width * 0.15
    half_w = width / 2
    for x in range(int(center_x - half_w), int(center_x + half_w) + 1, 2):
        t = (x - (center_x - half_w)) / width
        offset = math.sin(t * math.pi * 2) * amplitude
        points.append((x, center_y + offset))
    
    if len(points) >= 2:
        draw.line(points, fill=color, width=thickness)

if __name__ == '__main__':
    import os
    
    output_dir = os.path.join(os.path.dirname(__file__), '..', 'assets', 'icons')
    os.makedirs(output_dir, exist_ok=True)
    
    # 生成多种尺寸
    sizes = [192, 512, 1024]
    for size in sizes:
        output_path = os.path.join(output_dir, f'icon-{size}.png')
        generate_icon(size, output_path)
    
    print('All icons generated!')
