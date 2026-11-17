# Convert retained QA captures into web-sized JPEGs for the Cyber Access Protocol site.
# Source images stay untouched in production/qa/evidence/.
# Usage (from the repository root):
#   powershell -ExecutionPolicy Bypass -File website/_build/convert-captures.ps1

Add-Type -AssemblyName System.Drawing

$repo = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$outDir = Join-Path $repo 'website\assets\img'
New-Item -ItemType Directory -Force $outDir | Out-Null

$jpeg = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
    Where-Object { $_.MimeType -eq 'image/jpeg' }

function Convert-Capture {
    param(
        [string]$Source,
        [string]$Name,
        [int]$Width = 1280,
        [int]$Quality = 90
    )

    $path = Join-Path $repo $Source
    if (-not (Test-Path $path)) {
        Write-Warning "Missing source: $Source"
        return
    }

    $img = [System.Drawing.Image]::FromFile($path)
    try {
        $height = [int][Math]::Round($img.Height * ($Width / $img.Width))
        $bitmap = New-Object System.Drawing.Bitmap($Width, $height)
        try {
            $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
            try {
                $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
                $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
                $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
                $graphics.DrawImage($img, 0, 0, $Width, $height)
            } finally {
                $graphics.Dispose()
            }

            $parameters = New-Object System.Drawing.Imaging.EncoderParameters(1)
            $parameters.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
                [System.Drawing.Imaging.Encoder]::Quality, [long]$Quality)
            $target = Join-Path $outDir $Name
            $bitmap.Save($target, $jpeg, $parameters)
            $parameters.Dispose()
        } finally {
            $bitmap.Dispose()
        }
    } finally {
        $img.Dispose()
    }
}

# --- Campaign levels 1-50 -------------------------------------------------
$levels = @{}
$levels[1]  = 'production/qa/evidence/level1-lobby.png'
$levels[2]  = 'production/qa/evidence/level2-corridor.png'
$levels[3]  = 'production/qa/evidence/level3-server-hall.png'
$levels[4]  = 'production/qa/evidence/level4-noc.png'
$levels[5]  = 'production/qa/evidence/level5/level5-comms.png'
$levels[6]  = 'production/qa/evidence/level6/level6-atrium.png'
$levels[7]  = 'production/qa/evidence/level7/level7-gallery.png'
$levels[8]  = 'production/qa/evidence/level8/level8-control-hall.png'
$levels[9]  = 'production/qa/evidence/level9/level9-briefing.png'
$levels[10] = 'production/qa/evidence/level10/level10-core-arena.png'
$levels[11] = 'production/qa/evidence/art-bible-qa-2026-11-14/ui/l11-miniboss-intro.png'
foreach ($n in 12..20) {
    $levels[$n] = "production/qa/evidence/art-bible-qa-2026-11-14/missions/v2-level-$n.png"
}
foreach ($n in 21..30) {
    $levels[$n] = "production/qa/evidence/art-bible-qa-2026-11-14/missions/v3-level-$n.png"
}
foreach ($n in 31..40) {
    $levels[$n] = "production/qa/evidence/art-bible-qa-2026-11-14/missions/v4-level-$n.png"
}
foreach ($n in 41..50) {
    $levels[$n] = "production/qa/evidence/v5-2026-11-15/missions/level_$n.png"
}
foreach ($n in ($levels.Keys | Sort-Object)) {
    $id = $n.ToString('00')
    Convert-Capture -Source $levels[$n] -Name "level-$id.jpg" -Width 960 -Quality 90
}

# --- V5 painterly backdrops ----------------------------------------------
foreach ($n in 41..50) {
    Convert-Capture -Source "production/qa/evidence/v5-2026-11-16/v5-art-l$n.png" `
        -Name "v5-art-$n.jpg" -Width 1280 -Quality 90
}

# --- Boss captures --------------------------------------------------------
foreach ($n in 41..50) {
    Convert-Capture -Source "production/qa/evidence/v5-2026-11-15/bosses/level_$n.png" `
        -Name "boss-$n.jpg" -Width 1280 -Quality 90
}
Convert-Capture -Source 'production/qa/evidence/visual-guide-2026-11-15/bosses/v2-l12.png' -Name 'boss-v2.jpg'
Convert-Capture -Source 'production/qa/evidence/visual-guide-2026-11-15/bosses/v3-l23.png' -Name 'boss-v3.jpg'
Convert-Capture -Source 'production/qa/evidence/visual-guide-2026-11-15/bosses/v4-l34.png' -Name 'boss-v4.jpg'

# --- Interface and evidence screens --------------------------------------
$ui = @(
    @{ s = 'production/qa/evidence/visual-guide-2026-11-15/ui/menu.png';            n = 'menu.jpg';            q = 92 },
    @{ s = 'production/qa/evidence/visual-guide-2026-11-15/ui/settings-115.png';    n = 'settings.jpg';        q = 92 },
    @{ s = 'production/qa/evidence/visual-guide-2026-11-15/ui/credits.png';         n = 'credits.jpg';         q = 92 },
    @{ s = 'production/qa/evidence/visual-guide-2026-11-15/ui/pause.png';           n = 'pause.jpg';           q = 92 },
    @{ s = 'production/qa/evidence/visual-guide-2026-11-15/ui/debrief.png';         n = 'debrief.jpg';         q = 92 },
    @{ s = 'production/qa/evidence/v5-2026-11-16/archive-workbench-entry.png';      n = 'archive-entry.jpg';   q = 92 },
    @{ s = 'production/qa/evidence/v5-2026-11-15/archive-v5.png';                   n = 'archive-v5.jpg';      q = 92 },
    @{ s = 'production/qa/evidence/v5-2026-11-15/debrief-41.png';                   n = 'debrief-41.jpg';      q = 92 },
    @{ s = 'production/qa/evidence/v5-2026-11-16/debrief-l50-ending-A.png';         n = 'ending-a.jpg';        q = 92 },
    @{ s = 'production/qa/evidence/v5-2026-11-16/debrief-l50-ending-B.png';         n = 'ending-b.jpg';        q = 92 },
    @{ s = 'production/qa/evidence/v5-2026-11-16/debrief-l50-ending-C.png';         n = 'ending-c.jpg';        q = 92 },
    @{ s = 'production/qa/evidence/v5-2026-11-16/workbench-evidence.png';           n = 'workbench-evidence.jpg'; q = 92 },
    @{ s = 'production/qa/evidence/v5-2026-11-16/workbench-knowledge.png';          n = 'workbench-knowledge.jpg'; q = 92 },
    @{ s = 'production/qa/evidence/v5-2026-11-16/workbench-query.png';              n = 'workbench-query.jpg'; q = 92 },
    @{ s = 'production/qa/evidence/v5-2026-11-16/v5-terminal-domain-43.png';        n = 'terminal-43.jpg';     q = 92 },
    @{ s = 'production/qa/evidence/v5-2026-11-16/v5-terminal-domain-49.png';        n = 'terminal-49.jpg';     q = 92 },
    @{ s = 'production/qa/evidence/v5-2026-11-16/v5-query-terminal.png';            n = 'query-terminal.jpg';  q = 92 },
    @{ s = 'production/qa/evidence/v5-2026-11-15/terminal-41.png';                  n = 'terminal-41.jpg';     q = 92 },
    @{ s = 'production/qa/evidence/v5-2026-11-16/v5-consequence-variant.png';       n = 'consequence.jpg';     q = 92 }
)
foreach ($item in $ui) {
    Convert-Capture -Source $item.s -Name $item.n -Quality $item.q
}

# Wide contact sheet of all ten V5 backdrops.
Convert-Capture -Source 'production/qa/evidence/v5-2026-11-16/bespoke-art-sheet.png' `
    -Name 'art-sheet.jpg' -Width 1800 -Quality 88

# --- Clean V5 room plates (used as page backgrounds) ---------------------
# These are the shipped WebP backdrops, copied without re-encoding.
$plates = @(
    @{ s = 'assets/art/rooms/level_41_threat_intelligence.webp'; n = 'plate-41.webp' },
    @{ s = 'assets/art/rooms/level_42_the_hunt_begins.webp';     n = 'plate-42.webp' },
    @{ s = 'assets/art/rooms/level_43_forensic_fragments.webp';  n = 'plate-43.webp' },
    @{ s = 'assets/art/rooms/level_45_zero_day_clock.webp';      n = 'plate-45.webp' },
    @{ s = 'assets/art/rooms/level_47_ai_under_watch.webp';      n = 'plate-47.webp' },
    @{ s = 'assets/art/rooms/level_49_last_campaign.webp';       n = 'plate-49.webp' },
    @{ s = 'assets/art/rooms/level_50_beyond_firewall.webp';     n = 'plate-50.webp' }
)
foreach ($plate in $plates) {
    Copy-Item (Join-Path $repo $plate.s) (Join-Path $outDir $plate.n) -Force
}

# --- Levels 51–70: shipped room backdrops (WebP, copied without re-encoding) --
$v6v7 = @{
    51 = 'level_51_edge_of_trust'
    52 = 'level_52_the_living_grid'
    53 = 'level_53_signal_divide'
    54 = 'level_54_orbit_of_silence'
    55 = 'level_55_privacy_protocol'
    56 = 'level_56_sovereign_lines'
    57 = 'level_57_architecture_of_trust'
    58 = 'level_58_signal_in_the_crowd'
    59 = 'level_59_convergence'
    60 = 'level_60_the_open_network'
    61 = 'level_61_workstation_forge'
    62 = 'level_62_the_network_forge'
    63 = 'level_63_identity_in_motion'
    64 = 'level_64_cloud_guardrails'
    65 = 'level_65_the_build_line'
    66 = 'level_66_the_signal_workshop'
    67 = 'level_67_incident_in_motion'
    68 = 'level_68_restore_the_world'
    69 = 'level_69_the_human_ai_boundary'
    70 = 'level_70_the_living_system'
}
foreach ($n in ($v6v7.Keys | Sort-Object)) {
    $slug = $v6v7[$n]
    Copy-Item (Join-Path $repo "assets\art\rooms\$slug.webp") `
        (Join-Path $outDir ("level-{0:D2}.webp" -f $n)) -Force
}

# --- Chapter VI–VII page plates (clean backdrops) --------------------------
$platesV7 = @(
    @{ s = 'assets/art/rooms/level_51_edge_of_trust.webp';        n = 'plate-51.webp' },
    @{ s = 'assets/art/rooms/level_55_privacy_protocol.webp';     n = 'plate-55.webp' },
    @{ s = 'assets/art/rooms/level_59_convergence.webp';          n = 'plate-59.webp' },
    @{ s = 'assets/art/rooms/level_60_the_open_network.webp';     n = 'plate-60.webp' },
    @{ s = 'assets/art/rooms/level_61_workstation_forge.webp';    n = 'plate-61.webp' },
    @{ s = 'assets/art/rooms/level_65_the_build_line.webp';        n = 'plate-65.webp' },
    @{ s = 'assets/art/rooms/level_67_incident_in_motion.webp';    n = 'plate-67.webp' },
    @{ s = 'assets/art/rooms/level_70_the_living_system.webp';     n = 'plate-70.webp' }
)
foreach ($plate in $platesV7) {
    Copy-Item (Join-Path $repo $plate.s) (Join-Path $outDir $plate.n) -Force
}

# --- V6 / V7 interface, dialogue and practical captures -------------------
$v7ui = @(
    @{ s = 'production/qa/evidence/v7-2026-11-17/v7-mission-61.png';              n = 'v7-mission-61.jpg';           q = 92 },
    @{ s = 'production/qa/evidence/v7-2026-11-17/v7-zone-61.png';                 n = 'v7-zone-61.jpg';              q = 92 },
    @{ s = 'production/qa/evidence/v7-2026-11-17/v7-terminal-61.png';             n = 'v7-terminal-61.jpg';          q = 92 },
    @{ s = 'production/qa/evidence/v7-2026-11-17/v7-boss-61.png';                 n = 'v7-boss-61.jpg';              q = 92 },
    @{ s = 'production/qa/evidence/v7-2026-11-17/v7-debrief-70.png';              n = 'v7-debrief-70.jpg';           q = 92 },
    @{ s = 'production/qa/evidence/v7-2026-11-17/v7-dialogue-61.png';             n = 'v7-dialogue-61.jpg';          q = 92 },
    @{ s = 'production/qa/evidence/v7-2026-11-17/v7-dialogue-61-choices.png';     n = 'v7-dialogue-61-choices.jpg';  q = 92 },
    @{ s = 'production/qa/evidence/v7-2026-11-17/v7-dialogue-61-ur.png';          n = 'v7-dialogue-61-ur.jpg';       q = 92 },
    @{ s = 'production/qa/evidence/v7-2026-11-17/v7-practical-terminal-31.png';   n = 'v7-practical-terminal-31.jpg'; q = 92 },
    @{ s = 'production/qa/evidence/v7-2026-11-17/v7-practical-debrief-31.png';    n = 'v7-practical-debrief-31.jpg'; q = 92 },
    @{ s = 'production/qa/evidence/v7-2026-11-17/v7-terminal-62-canvas.png';      n = 'v7-terminal-62-canvas.jpg';   q = 92 },
    @{ s = 'production/qa/evidence/v7-2026-11-17/v7-terminal-67-timeline.png';    n = 'v7-terminal-67-timeline.jpg'; q = 92 },
    @{ s = 'production/qa/evidence/v7-2026-11-17/v7-terminal-67-skin.png';        n = 'v7-terminal-67-skin.jpg';     q = 92 },
    @{ s = 'production/qa/evidence/website-2026-11-17/archive-v7.png';             n = 'archive-v7.jpg';              q = 92 },
    @{ s = 'production/qa/evidence/v6-2026-11-17/v6-debrief-C.png';               n = 'v6-debrief-C.jpg';            q = 92 }
)
foreach ($item in $v7ui) {
    Convert-Capture -Source $item.s -Name $item.n -Quality $item.q
}

$count = (Get-ChildItem $outDir -File).Count
$size = [Math]::Round((Get-ChildItem $outDir -File | Measure-Object Length -Sum).Sum / 1MB, 1)
Write-Host "Wrote $count images to website/assets/img ($size MB)."
