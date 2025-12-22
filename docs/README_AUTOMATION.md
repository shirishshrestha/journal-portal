# Achievements System - Automatic Updates

## Overview

The achievements system is now **fully automated** using Celery Beat periodic tasks.

## What's Automatic

### 1. Badges (Real-time via Django Signals)

- **Author Badges**: Automatically awarded when publications are accepted/published
  - Thresholds: 1, 3, 5, 10, 20 publications
  - Levels: Bronze → Silver → Gold → Platinum → Diamond
- **Reviewer Badges**: Automatically awarded when reviews are completed
  - Thresholds: 1, 5, 10, 25, 50, 100 reviews
  - Levels: Bronze → Silver → Gold → Platinum → Diamond

### 2. Leaderboards (Daily via Celery Beat)

- **Schedule**: Runs every 24 hours
- **Task**: `apps.achievements.tasks.update_leaderboards`
- **Updates**:
  - Top 100 reviewers (ranked by reviews completed)
  - Top 100 authors (ranked by publications)
  - Calculates scores and metrics for current year

### 3. Awards (Periodic via Celery Beat)

#### Yearly Awards (January 1st)

- **Schedule**: Once per year
- **Task**: `apps.achievements.tasks.generate_yearly_awards`
- **Awards**:
  - **Best Reviewer**: Per journal, minimum 5 reviews
  - **Researcher of the Year**: Per journal, minimum 3 publications

#### Monthly Awards (1st of each month)

- **Schedule**: Once per month
- **Task**: `apps.achievements.tasks.generate_monthly_awards`
- **Awards**:
  - **Excellence in Review**: Reviewers with 3+ reviews in previous month

## Manual Trigger (Optional)

You can still manually trigger updates:

```bash
# Update leaderboards and generate awards
python manage.py populate_achievements

# Update leaderboards only (skip awards)
python manage.py populate_achievements --skip-awards
```

## Celery Configuration

### Required Services

- **Redis**: Must be running for Celery to work
- **Celery Worker**: Processes tasks
- **Celery Beat**: Schedules periodic tasks

### Start Celery Services

```bash
# Start Celery worker
celery -A journal_portal worker -l info

# Start Celery beat scheduler (in separate terminal)
celery -A journal_portal beat -l info
```

### Development Mode

In development, tasks run synchronously (no Celery worker needed):

```python
CELERY_TASK_ALWAYS_EAGER = True  # Set in settings.py
```

## Task Schedule

| Task                      | Frequency   | Description                                      |
| ------------------------- | ----------- | ------------------------------------------------ |
| `update_leaderboards`     | Daily (24h) | Recalculate all leaderboard rankings             |
| `generate_yearly_awards`  | Yearly      | Create best reviewer & researcher of year awards |
| `generate_monthly_awards` | Monthly     | Create excellence in review awards               |

## Monitoring

Check task execution in Django admin or via Celery Flower:

```bash
# Install flower
pip install flower

# Run flower dashboard
celery -A journal_portal flower
# Visit: http://localhost:5555
```

## Notes

- Badges are awarded instantly when actions occur (reviews completed, publications accepted)
- Leaderboards update daily, so rankings may be up to 24 hours behind
- Awards are generated retroactively (previous year/month)
- All tasks are idempotent (safe to run multiple times)
